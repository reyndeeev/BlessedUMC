import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function Events() {
  const events = [
    {
      date: { day: "30", month: "NOV" },
      title: "Church Anniversary",
      description: "Join a beautiful presentation of the Church Anniversary",
      dateText: "Sunday, November 30th",
      time: "7:00 PM",
      location: "Blessed UMC",
      gradient: "from-methodist-blue to-soft-green"
    },
    {
      date: { day: "22", month: "DEC" },
      title: "Christmas Eve Service",
      description: "Celebrate the birth of Christ with candlelight, carols, and communion.",
      dateText: "Christmas Eve",
      time: "5:00 PM & 11:00 PM",
      location: "Main Sanctuary",
      gradient: "from-warm-gold to-methodist-blue"
    },
    {
      date: { day: "05", month: "JAN" },
      title: "New Year Prayer Service",
      description: "Start the new year with prayer, reflection, and commitment to God.",
      dateText: "Sunday, January 5th",
      time: "6:00 PM",
      location: "Fellowship Hall",
      gradient: "from-soft-green to-warm-gold"
    }
  ];

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-methodist-blue mb-4">Upcoming Events</h2>
          <p className="text-xl text-warm-gray max-w-3xl mx-auto">
            Join us for special events, fellowship opportunities, and community gatherings throughout the year.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className={`h-48 bg-gradient-to-br ${event.gradient} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{event.date.day}</div>
                  <div className="text-lg">{event.date.month}</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-methodist-blue mb-2">{event.title}</h3>
                <p className="text-warm-gray mb-3">{event.description}</p>
                <div className="space-y-2 text-sm text-warm-gray mb-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{event.dateText}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <button 
                  className="text-methodist-blue hover:text-warm-gold font-medium"
                  data-testid={`button-event-${index}`}
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-methodist-blue text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
            data-testid="button-view-calendar"
          >
            View Full Calendar
          </Button>
        </div>
      </div>
    </section>
  );
}
