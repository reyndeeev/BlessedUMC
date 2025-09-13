import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings, ArrowLeft, Plus, Trash2, Edit, Play, Star } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSermonSchema } from "@shared/schema";
import type { Sermon, InsertSermon } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Sermons() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sermons, isLoading, error } = useQuery<Sermon[]>({
    queryKey: ["/api", "sermons"],
  });

  const form = useForm<InsertSermon>({
    resolver: zodResolver(insertSermonSchema),
    defaultValues: {
      title: "",
      pastor: "",
      date: "",
      scripture: undefined,
      description: undefined,
      videoUrl: undefined,
      audioUrl: undefined,
      thumbnailUrl: undefined,
      isLive: undefined,
      isFeatured: undefined,
    },
  });

  const createSermonMutation = useMutation({
    mutationFn: async (sermonData: InsertSermon) => {
      const response = await apiRequest('POST', '/api/sermons', sermonData);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create sermon');
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api", "sermons"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: `Sermon "${data.sermon.title}" created successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create sermon",
        variant: "destructive",
      });
    },
  });

  const updateSermonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertSermon> }) => {
      const response = await apiRequest('PUT', `/api/sermons/${id}`, data);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update sermon');
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api", "sermons"] });
      setEditingSermon(null);
      form.reset();
      toast({
        title: "Success",
        description: `Sermon "${data.sermon.title}" updated successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sermon",
        variant: "destructive",
      });
    },
  });

  const deleteSermonMutation = useMutation({
    mutationFn: async (sermonId: string) => {
      const response = await apiRequest('DELETE', `/api/sermons/${sermonId}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete sermon');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api", "sermons"] });
      toast({
        title: "Success",
        description: "Sermon deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete sermon",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertSermon) => {
    if (editingSermon) {
      updateSermonMutation.mutate({ id: editingSermon.id, data });
    } else {
      createSermonMutation.mutate(data);
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    form.reset({
      title: sermon.title,
      pastor: sermon.pastor,
      date: sermon.date,
      scripture: sermon.scripture ?? "",
      description: sermon.description ?? "",
      videoUrl: sermon.videoUrl ?? "",
      audioUrl: sermon.audioUrl ?? "",
      thumbnailUrl: sermon.thumbnailUrl ?? "",
      isLive: Boolean(sermon.isLive),
      isFeatured: Boolean(sermon.isFeatured),
    });
    setIsCreateDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingSermon(null);
    form.reset();
    setIsCreateDialogOpen(true);
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
            <h1 className="text-3xl font-bold text-gray-900">Sermon Management</h1>
          </div>
          <div className="text-center py-12">Loading sermons...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Sermon Management</h1>
          </div>
          <div className="text-center py-12 text-red-600">Error loading sermons</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Sermon Management</h1>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} data-testid="button-create-sermon">
                <Plus className="h-4 w-4 mr-2" />
                Add Sermon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSermon ? "Edit Sermon" : "Add New Sermon"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pastor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pastor *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-pastor" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="scripture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scripture</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="e.g., John 3:16" data-testid="input-scripture" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ""} data-testid="textarea-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-video-url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="audioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audio URL</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-audio-url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-thumbnail-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="isLive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-is-live"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Live Stream</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-is-featured"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Sermon</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                      disabled={createSermonMutation.isPending || updateSermonMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createSermonMutation.isPending || updateSermonMutation.isPending
                        ? "Saving..."
                        : editingSermon
                        ? "Update Sermon"
                        : "Create Sermon"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sermons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sermons?.map((sermon) => (
            <Card key={sermon.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {sermon.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      by {sermon.pastor} • {new Date(sermon.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {Boolean(sermon.isFeatured) && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {Boolean(sermon.isLive) && (
                      <Badge variant="destructive" className="text-xs">
                        <Play className="h-3 w-3 mr-1" />
                        Live
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {sermon.scripture && (
                  <p className="text-sm font-medium text-blue-600 mb-2">
                    {sermon.scripture}
                  </p>
                )}
                {sermon.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {sermon.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(sermon)}
                    data-testid={`button-edit-${sermon.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteSermonMutation.mutate(sermon.id)}
                    disabled={deleteSermonMutation.isPending}
                    data-testid={`button-delete-${sermon.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sermons?.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sermons yet</h3>
            <p className="text-gray-600 mb-4">Create your first sermon to get started.</p>
            <Button onClick={handleCreate} data-testid="button-create-first-sermon">
              <Plus className="h-4 w-4 mr-2" />
              Add First Sermon
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}