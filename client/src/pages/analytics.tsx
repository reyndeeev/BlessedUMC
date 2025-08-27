import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, MessageSquare, Activity, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalyticsData {
  totalUsers: number;
  totalMessages: number;
  recentMessages: number;
  activeUsersToday: number;
  messagesByDay: { date: string; count: number }[];
  topSubjects: { subject: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["/api", "analytics"],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-methodist-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load analytics</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/bumcdashboard">
                <Button variant="ghost" size="sm" data-testid="button-back-dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Website Analytics</h1>
                <p className="text-gray-600">Blessed United Methodist Church Admin</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                data-testid="button-refresh-analytics"
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-users">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-total-users">
                    {analytics?.totalUsers || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-total-messages">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-total-messages">
                    {analytics?.totalMessages || 0}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-recent-messages">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Messages (24h)</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-recent-messages">
                    {analytics?.recentMessages || 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-active-users">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users Today</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-active-users">
                    {analytics?.activeUsersToday || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Messages by Day Chart */}
          <Card data-testid="card-messages-chart">
            <CardHeader>
              <CardTitle>Messages by Day (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.messagesByDay || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Subjects Chart */}
          <Card data-testid="card-subjects-chart">
            <CardHeader>
              <CardTitle>Top Message Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {analytics?.topSubjects && analytics.topSubjects.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.topSubjects}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ subject, count, percent }) => 
                          `${subject}: ${count} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.topSubjects.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No message data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="mt-8">
          <Card data-testid="card-insights">
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Engagement Rate</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {analytics?.totalMessages && analytics?.totalUsers 
                      ? Math.round((analytics.totalMessages / Math.max(analytics.totalUsers, 1)) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Messages per user</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Level</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics?.recentMessages || 0 > 0 ? 'High' : 'Low'}
                  </p>
                  <p className="text-sm text-gray-600">Based on recent activity</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Trend</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {analytics?.totalUsers || 0 > 0 ? 'Growing' : 'Starting'}
                  </p>
                  <p className="text-sm text-gray-600">User base status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}