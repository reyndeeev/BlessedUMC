import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, MessageSquare, ArrowLeft, Users, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { ContactMessage } from "@shared/schema";

export default function Admin() {
  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ["/api", "contact-messages"],
  });

  const unreadCount = messages?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back-home">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Website
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Blessed United Methodist Church</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Contact Messages Card */}
          <Card className="hover:shadow-md transition-shadow" data-testid="card-contact-messages">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-lg">Contact Messages</CardTitle>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="secondary" data-testid="badge-message-count">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View and manage contact form submissions from website visitors.
              </p>
              <Link href="/bumcdashboard/messages">
                <Button className="w-full" data-testid="button-view-messages">
                  View Messages
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Users Management Card */}
          <Card className="hover:shadow-md transition-shadow" data-testid="card-user-management">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-green-500" />
                <CardTitle className="text-lg">User Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage user accounts and permissions for the website.
              </p>
              <Button variant="outline" className="w-full" disabled data-testid="button-manage-users">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="hover:shadow-md transition-shadow" data-testid="card-analytics">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                <CardTitle className="text-lg">Website Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View website traffic and engagement statistics.
              </p>
              <Button variant="outline" className="w-full" disabled data-testid="button-view-analytics">
                Coming Soon
              </Button>
            </CardContent>
          </Card>


        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card data-testid="card-stat-messages">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Messages</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-total-messages">
                      {unreadCount}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-stat-users">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Registered Users</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-total-users">
                      -
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-activity">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recent Activity</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-recent-activity">
                      {unreadCount > 0 ? 'Active' : 'Quiet'}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}