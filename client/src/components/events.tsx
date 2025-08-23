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
      date: { day: "", month: "" },
      title: "TBA",
      description: "",
      dateText: "",
      time: "",
      location: "",
      gradient: "from-warm-gold to-methodist-blue"
    },
    {
      date: { day: "", month: "" },
      title: "TBA",
      description: "",
      dateText: "",
      time: "",
      location: "",
      gradient: "from-soft-green to-warm-gold"
    }
  ];

  return (
    <section id="events" className="py-24 bg-gradient-to-br from-gray-100 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Planetshakers-style section header */}
        <div className="text-center mb-16">
          <h3 className="font-heading text-sm font-bold tracking-wide text-methodist-blue uppercase mb-4">
            Church Life
          </h3>
          <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience God's love through dynamic events, fellowship opportunities, and life-changing gatherings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={index} className="group">
              {/* Enhanced Event Card */}
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:-translate-y-2 border border-gray-100">
                {/* Date Header with Gradient */}
                <div className={`h-56 bg-gradient-to-br ${event.gradient} flex items-center justify-center relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="relative text-center text-white z-10">
                    <div className="text-5xl font-black mb-2">{event.date.day}</div>
                    <div className="text-xl font-bold tracking-wide">{event.date.month}</div>
                  </div>
                  {event.title !== "TBA" && (
                    <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                      UPCOMING
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <h3 className="font-heading text-2xl font-black text-gray-900 mb-3 tracking-tight">{event.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                  
                  {event.title !== "TBA" && (
                    <>
                      <div className="space-y-3 text-sm text-gray-600 mb-6">
                        <div className="flex items-center p-2 rounded-lg bg-gray-50">
                          <Calendar className="mr-3 h-4 w-4 text-methodist-blue" />
                          <span className="font-medium">{event.dateText}</span>
                        </div>
                        <div className="flex items-center p-2 rounded-lg bg-gray-50">
                          <Clock className="mr-3 h-4 w-4 text-methodist-blue" />
                          <span className="font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center p-2 rounded-lg bg-gray-50">
                          <MapPin className="mr-3 h-4 w-4 text-methodist-blue" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                      </div>
                      
                      <Button
                        className="bg-methodist-blue hover:bg-methodist-blue/90 text-white px-6 py-3 rounded-full text-sm font-bold w-full transition-all transform hover:scale-105 shadow-lg"
                        data-testid={`button-event-${index}`}
                      >
                        Learn More
                      </Button>
                    </>
                  )}
                  
                  {event.title === "TBA" && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 font-medium">More amazing events coming soon!</p>
                      <div className="mt-4 text-xs text-gray-300">Stay tuned for updates</div>
                    </div>
                  )}
                </div>
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
