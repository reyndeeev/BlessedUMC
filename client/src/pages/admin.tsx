import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, MessageSquare, ArrowLeft, Users, BarChart3, LogOut, User as UserIcon, Calendar, Heart, Play } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { ContactMessage, User } from "@shared/schema";

interface AnalyticsData {
  totalUsers: number;
  totalMessages: number;
  recentMessages: number;
  activeUsersToday: number;
  messagesByDay: { date: string; count: number }[];
  topSubjects: { subject: string; count: number }[];
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, logout, isLoggingOut } = useAuth();
  
  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ["/api", "contact-messages"],
  });

  const { data: users } = useQuery<Omit<User, 'password'>[]>({
    queryKey: ["/api", "users"],
  });

  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api", "analytics"],
  });

  const unreadCount = messages?.length || 0;
  const userCount = users?.length || 0;
  
  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserIcon className="h-4 w-4" />
                <span>Welcome, {user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
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
              <Link href="/bumcdashboard/users">
                <Button className="w-full" data-testid="button-manage-users">
                  Manage Users
                  {userCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {userCount}
                    </Badge>
                  )}
                </Button>
              </Link>
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
              <Link href="/bumcdashboard/analytics">
                <Button className="w-full" data-testid="button-view-analytics">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Sermon Management Card */}
          <Card className="hover:shadow-md transition-shadow" data-testid="card-sermon-management">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Play className="h-6 w-6 text-red-500" />
                <CardTitle className="text-lg">Sermon Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage sermons, featured content, and video/audio resources.
              </p>
              <Link href="/bumcdashboard/sermons">
                <Button className="w-full" data-testid="button-manage-sermons">
                  Manage Sermons
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Birthday Management Card */}
          <Card className="hover:shadow-md transition-shadow" data-testid="card-birthday-management">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-lg">Birthday Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track and manage member birthdays and celebration reminders.
              </p>
              <Link href="/bumcdashboard/birthdays">
                <Button className="w-full" data-testid="button-manage-birthdays">
                  Manage Birthdays
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Anniversary Management Card */}
          <Card className="hover:shadow-md transition-shadow" data-testid="card-anniversary-management">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-500" />
                <CardTitle className="text-lg">Anniversary Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track and manage member anniversaries and milestone celebrations.
              </p>
              <Link href="/bumcdashboard/anniversaries">
                <Button className="w-full" data-testid="button-manage-anniversaries">
                  Manage Anniversaries
                </Button>
              </Link>
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
                      {userCount}
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
                    <p className="text-sm text-gray-600">Recent Messages (24h)</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-recent-activity">
                      {analytics?.recentMessages || 0}
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