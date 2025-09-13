import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings, ArrowLeft, Plus, Trash2, Edit, Calendar, Mail, Phone, Upload } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBirthdaySchema } from "@shared/schema";
import type { Birthday, InsertBirthday } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Birthdays() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: birthdays, isLoading, error } = useQuery<Birthday[]>({
    queryKey: ["/api", "birthdays"],
  });

  const form = useForm<InsertBirthday>({
    resolver: zodResolver(insertBirthdaySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      phone: undefined,
      email: undefined,
      isActive: undefined,
    },
  });

  const createBirthdayMutation = useMutation({
    mutationFn: async (birthdayData: InsertBirthday) => {
      const response = await apiRequest('POST', '/api/birthdays', birthdayData);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create birthday');
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api", "birthdays"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: `Birthday for ${data.birthday.firstName} ${data.birthday.lastName} created successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create birthday",
        variant: "destructive",
      });
    },
  });

  const updateBirthdayMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBirthday> }) => {
      const response = await apiRequest('PUT', `/api/birthdays/${id}`, data);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update birthday');
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api", "birthdays"] });
      setEditingBirthday(null);
      form.reset();
      toast({
        title: "Success",
        description: `Birthday for ${data.birthday.firstName} ${data.birthday.lastName} updated successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update birthday",
        variant: "destructive",
      });
    },
  });

  const deleteBirthdayMutation = useMutation({
    mutationFn: async (birthdayId: string) => {
      const response = await apiRequest('DELETE', `/api/birthdays/${birthdayId}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete birthday');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api", "birthdays"] });
      toast({
        title: "Success",
        description: "Birthday deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete birthday",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertBirthday) => {
    if (editingBirthday) {
      updateBirthdayMutation.mutate({ id: editingBirthday.id, data });
    } else {
      createBirthdayMutation.mutate(data);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast({ title: "Please enter data to import", variant: "destructive" });
      return;
    }

    try {
      const lines = importData.trim().split('\n').filter(line => line.trim());
      const birthdays = [];

      for (const line of lines) {
        // Try different separators
        let parts;
        if (line.includes('\t')) {
          parts = line.split('\t');
        } else if (line.includes(',')) {
          parts = line.split(',').map(p => p.trim());
        } else {
          parts = line.split(/\s+/);
        }

        if (parts.length < 3) continue;

        const firstName = parts[0]?.trim();
        const lastName = parts[1]?.trim();
        let birthDate = parts[2]?.trim();
        const phone = parts[3]?.trim() || null;
        const email = parts[4]?.trim() || null;

        // Handle date formats
        if (birthDate && !birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Try to convert MM/DD/YYYY or other formats
          const date = new Date(birthDate);
          if (!isNaN(date.getTime())) {
            birthDate = date.toISOString().split('T')[0];
          }
        }

        if (firstName && lastName && birthDate) {
          birthdays.push({
            firstName,
            lastName,
            birthDate,
            phone,
            email
          });
        }
      }

      if (birthdays.length === 0) {
        toast({ title: "No valid birthdays found in the data", variant: "destructive" });
        return;
      }

      // Import all birthdays
      for (const birthday of birthdays) {
        await createBirthdayMutation.mutateAsync(birthday);
      }

      toast({ title: `Successfully imported ${birthdays.length} birthdays!` });
      setImportData('');
      setIsImportDialogOpen(false);
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import birthdays",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    form.reset({
      firstName: birthday.firstName,
      lastName: birthday.lastName,
      birthDate: birthday.birthDate,
      phone: birthday.phone ?? "",
      email: birthday.email ?? "",
      isActive: Boolean(birthday.isActive),
    });
    setIsCreateDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingBirthday(null);
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString();
  };

  const getNextBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate + 'T00:00:00');
    const thisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (thisYear < today) {
      thisYear.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntil = Math.ceil((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bumcdashboard" data-testid="back-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <Settings className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Birthday Management</h1>
          </div>
          <div className="text-center py-12">Loading birthdays...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bumcdashboard" data-testid="back-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <Settings className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Birthday Management</h1>
          </div>
          <div className="text-center py-12 text-red-600">Error loading birthdays</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bumcdashboard" data-testid="back-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <Settings className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Birthday Management</h1>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-import-birthdays">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from Google Docs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import Birthdays from Google Docs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Paste your data (format: First Name, Last Name, Birth Date, Phone, Email)
                    </label>
                    <Textarea 
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Example:&#10;John Smith 1990-03-15 555-1234 john@email.com&#10;Sarah Johnson 1985-07-22 555-5678 sarah@email.com"
                      className="min-h-48 font-mono text-sm"
                      data-testid="textarea-import-data"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Supported formats:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• Comma-separated: John, Smith, 1990-03-15, 555-1234, john@email.com</li>
                      <li>• Tab-separated (copy directly from Google Docs table)</li>
                      <li>• Space-separated: John Smith 1990-03-15 555-1234 john@email.com</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleImport} data-testid="button-process-import">
                      Import Data
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} data-testid="button-create-birthday">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Birthday
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingBirthday ? "Edit Birthday" : "Add New Birthday"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-birth-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""} 
                            type="email" 
                            data-testid="input-email" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""} 
                            type="tel" 
                            data-testid="input-phone" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-is-active"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createBirthdayMutation.isPending || updateBirthdayMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createBirthdayMutation.isPending || updateBirthdayMutation.isPending
                        ? "Saving..."
                        : editingBirthday
                        ? "Update Birthday"
                        : "Create Birthday"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Birthdays Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {birthdays?.map((birthday) => (
            <Card key={birthday.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {birthday.firstName} {birthday.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(birthday.birthDate)}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {Boolean(birthday.isActive) && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                    {getNextBirthday(birthday.birthDate) <= 30 && (
                      <Badge variant="default" className="text-xs">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {birthday.email && (
                    <p className="text-sm text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {birthday.email}
                    </p>
                  )}
                  {birthday.phone && (
                    <p className="text-sm text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {birthday.phone}
                    </p>
                  )}
                  <p className="text-sm font-medium text-blue-600">
                    Next birthday in {getNextBirthday(birthday.birthDate)} days
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(birthday)}
                    data-testid={`button-edit-${birthday.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteBirthdayMutation.mutate(birthday.id)}
                    disabled={deleteBirthdayMutation.isPending}
                    data-testid={`button-delete-${birthday.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {birthdays?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No birthdays yet</h3>
            <p className="text-gray-600 mb-4">Add the first birthday to get started.</p>
            <Button onClick={handleCreate} data-testid="button-create-first-birthday">
              <Plus className="h-4 w-4 mr-2" />
              Add First Birthday
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}