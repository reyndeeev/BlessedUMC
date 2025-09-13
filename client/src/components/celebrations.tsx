import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Mail, Phone, AlertTriangle } from "lucide-react";
import type { Birthday, Anniversary } from "@shared/schema";

export default function Celebrations() {
  // Fetch upcoming birthdays
  const { data: upcomingBirthdays = [], isLoading: birthdaysLoading, error: birthdaysError } = useQuery<Birthday[]>({
    queryKey: ["/api", "birthdays", "upcoming"],
    queryFn: async () => {
      const response = await fetch('/api/birthdays/upcoming?days=30');
      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming birthdays: ${response.status}`);
      }
      return response.json();
    },
  });

  // Fetch upcoming anniversaries
  const { data: upcomingAnniversaries = [], isLoading: anniversariesLoading, error: anniversariesError } = useQuery<Anniversary[]>({
    queryKey: ["/api", "anniversaries", "upcoming"],
    queryFn: async () => {
      const response = await fetch('/api/anniversaries/upcoming?days=30');
      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming anniversaries: ${response.status}`);
      }
      return response.json();
    },
  });

  const isLoading = birthdaysLoading || anniversariesLoading;
  const hasError = birthdaysError || anniversariesError;

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString + 'T00:00:00');
    const thisYear = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    if (thisYear < today) {
      thisYear.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntil = Math.ceil((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  // Don't show the section if no upcoming celebrations and not loading and no errors
  if (!isLoading && !hasError && upcomingBirthdays.length === 0 && upcomingAnniversaries.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="font-heading text-sm font-bold tracking-wide text-methodist-blue uppercase mb-4">
            Church Family
          </h3>
          <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Upcoming Celebrations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in celebrating the special moments in our church family's life. 
            Birthdays, anniversaries, and milestones that bring us together.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hasError ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-2xl font-heading font-bold text-red-600 mb-4">
              Unable to Load Celebrations
            </h3>
            <p className="text-red-500 mb-6 max-w-md mx-auto">
              We're having trouble loading upcoming birthdays and anniversaries. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-reload-celebrations"
            >
              Refresh Page
            </Button>
          </div>
        ) : (
          <>
            {/* Birthdays Section */}
            {upcomingBirthdays.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center mb-8">
                  <Calendar className="h-6 w-6 text-methodist-blue mr-3" />
                  <h3 className="text-2xl font-heading font-bold text-gray-900">
                    Upcoming Birthdays
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingBirthdays.slice(0, 6).map((birthday) => (
                    <Card key={birthday.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          {birthday.firstName} {birthday.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {formatDate(birthday.birthDate)} • {getDaysUntil(birthday.birthDate)} days
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          {birthday.email && (
                            <p className="text-sm text-gray-700 flex items-center">
                              <Mail className="h-3 w-3 mr-2" />
                              {birthday.email}
                            </p>
                          )}
                          {birthday.phone && (
                            <p className="text-sm text-gray-700 flex items-center">
                              <Phone className="h-3 w-3 mr-2" />
                              {birthday.phone}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Anniversaries Section */}
            {upcomingAnniversaries.length > 0 && (
              <div>
                <div className="flex items-center mb-8">
                  <Heart className="h-6 w-6 text-pink-500 mr-3" />
                  <h3 className="text-2xl font-heading font-bold text-gray-900">
                    Upcoming Anniversaries
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingAnniversaries.slice(0, 6).map((anniversary) => (
                    <Card key={anniversary.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-pink-500" />
                          {anniversary.husbandName} & {anniversary.wifeName}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {formatDate(anniversary.anniversaryDate)} • {getDaysUntil(anniversary.anniversaryDate)} days
                          {anniversary.yearsMarried && ` • ${anniversary.yearsMarried} years`}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          {anniversary.email && (
                            <p className="text-sm text-gray-700 flex items-center">
                              <Mail className="h-3 w-3 mr-2" />
                              {anniversary.email}
                            </p>
                          )}
                          {anniversary.phone && (
                            <p className="text-sm text-gray-700 flex items-center">
                              <Phone className="h-3 w-3 mr-2" />
                              {anniversary.phone}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Show message if no data */}
            {upcomingBirthdays.length === 0 && upcomingAnniversaries.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming celebrations</h3>
                <p className="text-gray-600">Check back soon for birthdays and anniversaries to celebrate!</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}