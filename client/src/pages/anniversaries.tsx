import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings, ArrowLeft, Plus, Trash2, Edit, Calendar, Mail, Phone, Heart, Upload } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnniversarySchema } from "@shared/schema";
import type { Anniversary, InsertAnniversary } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Anniversaries() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [editingAnniversary, setEditingAnniversary] = useState<Anniversary | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: anniversaries, isLoading, error } = useQuery<Anniversary[]>({
    queryKey: ["/api", "anniversaries"],
  });

  const form = useForm<InsertAnniversary>({
    resolver: zodResolver(insertAnniversarySchema),
    defaultValues: {
      husbandName: "",
      wifeName: "",
      anniversaryDate: "",
      phone: undefined,
      email: undefined,
      yearsMarried: undefined,
      isActive: undefined,
    },
  });

  const createAnniversaryMutation = useMutation({
    mutationFn: async (anniversaryData: InsertAnniversary) => {
      const response = await apiRequest('POST', '/api/anniversaries', anniversaryData);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create anniversary');
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api", "anniversaries"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: `Anniversary for ${data.anniversary.husbandName} & ${data.anniversary.wifeName} created successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create anniversary",
        variant: "destructive",
      });
    },
  });

  const updateAnniversaryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertAnniversary> }) => {
      const response = await apiRequest('PUT', `/api/anniversaries/${id}`, data);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update anniversary');
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api", "anniversaries"] });
      setEditingAnniversary(null);
      form.reset();
      toast({
        title: "Success",
        description: `Anniversary for ${data.anniversary.husbandName} & ${data.anniversary.wifeName} updated successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update anniversary",
        variant: "destructive",
      });
    },
  });

  const deleteAnniversaryMutation = useMutation({
    mutationFn: async (anniversaryId: string) => {
      const response = await apiRequest('DELETE', `/api/anniversaries/${anniversaryId}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete anniversary');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api", "anniversaries"] });
      toast({
        title: "Success",
        description: "Anniversary deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete anniversary",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertAnniversary) => {
    if (editingAnniversary) {
      updateAnniversaryMutation.mutate({ id: editingAnniversary.id, data });
    } else {
      createAnniversaryMutation.mutate(data);
    }
  };

  const handleEdit = (anniversary: Anniversary) => {
    setEditingAnniversary(anniversary);
    form.reset({
      husbandName: anniversary.husbandName,
      wifeName: anniversary.wifeName,
      anniversaryDate: anniversary.anniversaryDate,
      phone: anniversary.phone ?? "",
      email: anniversary.email ?? "",
      yearsMarried: anniversary.yearsMarried ?? "",
      isActive: Boolean(anniversary.isActive),
    });
    setIsCreateDialogOpen(true);
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast({ title: "Please enter data to import", variant: "destructive" });
      return;
    }

    try {
      const lines = importData.trim().split('\n').filter(line => line.trim());
      const anniversaries = [];

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

        const husbandName = parts[0]?.trim();
        const wifeName = parts[1]?.trim();
        let anniversaryDate = parts[2]?.trim();
        const phone = parts[3]?.trim() || null;
        const email = parts[4]?.trim() || null;
        const yearsMarried = parts[5]?.trim() || null;

        // Handle date formats
        if (anniversaryDate && !anniversaryDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Try to convert MM/DD/YYYY or other formats
          const date = new Date(anniversaryDate);
          if (!isNaN(date.getTime())) {
            anniversaryDate = date.toISOString().split('T')[0];
          }
        }

        if (husbandName && wifeName && anniversaryDate) {
          anniversaries.push({
            husbandName,
            wifeName,
            anniversaryDate,
            phone,
            email,
            yearsMarried
          });
        }
      }

      if (anniversaries.length === 0) {
        toast({ title: "No valid anniversaries found in the data", variant: "destructive" });
        return;
      }

      // Import all anniversaries
      for (const anniversary of anniversaries) {
        await createAnniversaryMutation.mutateAsync(anniversary);
      }

      toast({ title: `Successfully imported ${anniversaries.length} anniversaries!` });
      setImportData('');
      setIsImportDialogOpen(false);
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import anniversaries",
        variant: "destructive"
      });
    }
  };

  const handleCreate = () => {
    setEditingAnniversary(null);
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString();
  };

  const getNextAnniversary = (anniversaryDate: string) => {
    const today = new Date();
    const anniversary = new Date(anniversaryDate + 'T00:00:00');
    const thisYear = new Date(today.getFullYear(), anniversary.getMonth(), anniversary.getDate());
    
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
            <h1 className="text-3xl font-bold text-gray-900">Anniversary Management</h1>
          </div>
          <div className="text-center py-12">Loading anniversaries...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Anniversary Management</h1>
          </div>
          <div className="text-center py-12 text-red-600">Error loading anniversaries</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Anniversary Management</h1>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-import-anniversaries">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from Google Docs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import Anniversaries from Google Docs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Paste your anniversary data below. Supports multiple formats:
                    </p>
                    <ul className="text-xs text-gray-500 mb-4 list-disc list-inside space-y-1">
                      <li>Comma-separated: HusbandName, WifeName, Date, Phone, Email, Years</li>
                      <li>Tab-separated (copy from spreadsheet)</li>
                      <li>Space-separated: HusbandName WifeName Date Phone Email Years</li>
                      <li>Date format: YYYY-MM-DD or MM/DD/YYYY</li>
                    </ul>
                    <Textarea
                      placeholder="John, Mary, 2010-05-15, 555-1234, john.mary@email.com, 13&#10;Robert, Linda, 2005-08-20, 555-5678, robert.linda@email.com, 18&#10;David Jennifer 2015-12-03 555-9012 david.jennifer@email.com 8"
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      className="min-h-32"
                      data-testid="textarea-import-data"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsImportDialogOpen(false)}
                      data-testid="button-cancel-import"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={createAnniversaryMutation.isPending}
                      data-testid="button-import-submit"
                    >
                      {createAnniversaryMutation.isPending ? "Importing..." : "Import Anniversaries"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} data-testid="button-create-anniversary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Anniversary
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAnniversary ? "Edit Anniversary" : "Add New Anniversary"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="husbandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Husband's Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-husband-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="wifeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wife's Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-wife-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="anniversaryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anniversary Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-anniversary-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="yearsMarried"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years Married</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""} 
                            placeholder="e.g., 25" 
                            data-testid="input-years-married" 
                          />
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
                      disabled={createAnniversaryMutation.isPending || updateAnniversaryMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createAnniversaryMutation.isPending || updateAnniversaryMutation.isPending
                        ? "Saving..."
                        : editingAnniversary
                        ? "Update Anniversary"
                        : "Create Anniversary"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Anniversaries Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {anniversaries?.map((anniversary) => (
            <Card key={anniversary.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold leading-tight flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      {anniversary.husbandName} & {anniversary.wifeName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(anniversary.anniversaryDate)}
                      {anniversary.yearsMarried && ` • ${anniversary.yearsMarried} years`}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {Boolean(anniversary.isActive) && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                    {getNextAnniversary(anniversary.anniversaryDate) <= 30 && (
                      <Badge variant="default" className="text-xs">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {anniversary.email && (
                    <p className="text-sm text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {anniversary.email}
                    </p>
                  )}
                  {anniversary.phone && (
                    <p className="text-sm text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {anniversary.phone}
                    </p>
                  )}
                  <p className="text-sm font-medium text-blue-600">
                    Next anniversary in {getNextAnniversary(anniversary.anniversaryDate)} days
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(anniversary)}
                    data-testid={`button-edit-${anniversary.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteAnniversaryMutation.mutate(anniversary.id)}
                    disabled={deleteAnniversaryMutation.isPending}
                    data-testid={`button-delete-${anniversary.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {anniversaries?.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No anniversaries yet</h3>
            <p className="text-gray-600 mb-4">Add the first anniversary to get started.</p>
            <Button onClick={handleCreate} data-testid="button-create-first-anniversary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Anniversary
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}