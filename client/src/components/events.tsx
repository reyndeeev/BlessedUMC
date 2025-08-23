
import React from 'react';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function Events() {
  const events = [
    {
      title: "Sunday Worship Service",
      description: "Join us for our weekly worship service with inspiring music and meaningful messages.",
      date: "Every Sunday",
      time: "9:00 AM",
      location: "Main Sanctuary",
      type: "Weekly Service",
      color: "bg-methodist-blue",
      recurring: true
    },
    {
      title: "UMYF Youth Meeting",
      description: "Young people gathering for fellowship, games, and spiritual growth activities.",
      date: "Every Friday",
      time: "6:00 PM",
      location: "Youth Room",
      type: "Youth Ministry",
      color: "bg-warm-gold",
      recurring: true
    },
    {
      title: "Bible Study Group",
      description: "Deep dive into Scripture with fellow believers in an intimate small group setting.",
      date: "Every Wednesday",
      time: "7:00 PM",
      location: "Fellowship Hall",
      type: "Bible Study",
      color: "bg-soft-green",
      recurring: true
    },
    {
      title: "Community Outreach",
      description: "Serving our local community through acts of kindness and support programs.",
      date: "2nd Saturday",
      time: "10:00 AM",
      location: "Various Locations",
      type: "Community Service",
      color: "bg-purple-600",
      recurring: true
    },
    {
      title: "Prayer & Praise Night",
      description: "An evening dedicated to prayer, worship music, and spiritual reflection.",
      date: "1st Friday",
      time: "7:30 PM",
      location: "Main Sanctuary",
      type: "Prayer Service",
      color: "bg-blue-600",
      recurring: true
    },
    {
      title: "Children's Ministry",
      description: "Fun and educational activities for our youngest church members.",
      date: "Every Sunday",
      time: "9:00 AM",
      location: "Children's Wing",
      type: "Children's Ministry",
      color: "bg-pink-600",
      recurring: true
    }
  ];

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upcoming Events & Activities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join us for worship, fellowship, and community service. There's always something 
            happening at Blessed UMC for every age and interest.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden"
            >
              <div className={`h-2 ${event.color}`} />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${event.color}`}>
                    {event.type}
                  </span>
                  {event.recurring && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Recurring
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-methodist-blue transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="mr-3 text-methodist-blue" size={18} />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="mr-3 text-methodist-blue" size={18} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="mr-3 text-methodist-blue" size={18} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="bg-methodist-blue/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-methodist-blue/10">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Stay Updated?
            </h3>
            <p className="text-gray-600 mb-6">
              Follow us on Facebook to get the latest updates on events, activities, and church announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://www.facebook.com/profile.php?id=61556573281040', '_blank')}
                className="bg-methodist-blue hover:bg-methodist-blue/90 text-white"
              >
                <ExternalLink className="mr-2" size={18} />
                Follow Main Church Page
              </Button>
              <Button
                onClick={() => window.open('https://www.facebook.com/blessedumyf01', '_blank')}
                className="bg-warm-gold hover:bg-warm-gold/90 text-black"
              >
                <Users className="mr-2" size={18} />
                Follow Youth Ministry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
