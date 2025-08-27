import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, User, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { ContactMessage } from "@shared/schema";

const subjectLabels = {
  general: "General Question",
  visit: "Planning a Visit",
  ministry: "Ministry Information",
  pastoral: "Pastoral Care",
  event: "Event Information",
  other: "Other"
};

const subjectColors = {
  general: "bg-blue-100 text-blue-800",
  visit: "bg-green-100 text-green-800",
  ministry: "bg-purple-100 text-purple-800",
  pastoral: "bg-orange-100 text-orange-800",
  event: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800"
};

export default function Admin() {
  const { data: messages, isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ["/api", "contact-messages"],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-methodist-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load messages</p>
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
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Website
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600">Blessed United Methodist Church Admin</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {messages?.length || 0} messages
              </Badge>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-600">Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <User className="w-5 h-5 text-methodist-blue" />
                        <span>{message.firstName} {message.lastName}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{message.email}</span>
                        </span>
                        {message.phone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{message.phone}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}</span>
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      className={`ml-4 ${subjectColors[message.subject as keyof typeof subjectColors] || subjectColors.other}`}
                    >
                      {subjectLabels[message.subject as keyof typeof subjectLabels] || message.subject}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 rounded-b-lg">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => window.open(`mailto:${message.email}?subject=Re: ${subjectLabels[message.subject as keyof typeof subjectLabels] || message.subject}`)}
                      size="sm"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                    {message.phone && (
                      <Button
                        onClick={() => window.open(`tel:${message.phone}`)}
                        variant="outline"
                        size="sm"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}