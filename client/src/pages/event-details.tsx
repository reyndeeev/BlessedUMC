import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, Users, Info } from "lucide-react";

const events = [
  {
    id: 0,
    date: { day: "23", month: "NOV" },
    title: "Church Anniversary",
    description: "Join a beautiful presentation of the Church Anniversary",
    fullDescription: "HE HAS SHOWN YOU, O MORTAL, WHAT IS GOOD. aND WHAT DOES THE LORD REQUIRE OF YOU? TO ACT JUSTLY AND TO LOVE MERCY AND TO WALK HUMBLY WITH YOUR GOD.",
    dateText: "Sunday, November 30th",
    time: "7:00 PM",
    location: "Blessed UMC",
    gradient: "from-methodist-blue to-soft-green",
    highlights: [
      "Special worship and praise",
      "Guest speakers and testimonies",
      "Light refreshments and fellowship",
      "Commemorative program"
    ]
  },
  {
    id: 1,
    date: { day: "", month: "" },
    title: "TBA",
    description: "",
    fullDescription: "",
    dateText: "",
    time: "",
    location: "",
    gradient: "from-warm-gold to-methodist-blue",
    highlights: []
  },
  {
    id: 2,
    date: { day: "", month: "" },
    title: "TBA",
    description: "",
    fullDescription: "",
    dateText: "",
    time: "",
    location: "",
    gradient: "from-soft-green to-warm-gold",
    highlights: []
  },
];

export default function EventDetails() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id ? parseInt(params.id) : 0;
  const event = events[eventId] || events[0];

  if (event.title === "TBA") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Coming Soon</h1>
          <p className="text-gray-600 mb-8">This event is still being planned. Check back later for details!</p>
          <Link href="/">
            <Button className="bg-methodist-blue hover:bg-methodist-blue/90" data-testid="button-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className={`bg-gradient-to-br ${event.gradient} py-16 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-6"
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-white">
            <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-bold">UPCOMING EVENT</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-heading font-black mb-4 tracking-tight">
              {event.title}
            </h1>
            <p className="text-xl lg:text-2xl font-light max-w-3xl">
              {event.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center mb-6">
                <Info className="h-6 w-6 text-methodist-blue mr-3" />
                <h2 className="text-3xl font-heading font-bold text-gray-900">Event Details</h2>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {event.fullDescription}
              </p>

              {event.highlights.length > 0 && (
                <>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                    What to Expect
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start" data-testid={`highlight-${index}`}>
                        <div className="bg-methodist-blue rounded-full p-1 mr-3 mt-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="border-t pt-6">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
                  Have Questions?
                </h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this event, please don't hesitate to reach out to us.
                </p>
                <Link href="/#contact">
                  <Button 
                    className="bg-methodist-blue hover:bg-methodist-blue/90 text-white"
                    data-testid="button-contact"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <div className="text-center mb-8">
                <div className={`bg-gradient-to-br ${event.gradient} rounded-2xl p-8 mb-6`}>
                  <div className="text-white">
                    <div className="text-6xl font-black mb-2">{event.date.day}</div>
                    <div className="text-2xl font-bold tracking-wide">{event.date.month}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-methodist-blue mr-3" />
                    <span className="font-semibold text-gray-900">Date</span>
                  </div>
                  <p className="text-gray-700 ml-8">{event.dateText}</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-methodist-blue mr-3" />
                    <span className="font-semibold text-gray-900">Time</span>
                  </div>
                  <p className="text-gray-700 ml-8">{event.time}</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-methodist-blue mr-3" />
                    <span className="font-semibold text-gray-900">Location</span>
                  </div>
                  <p className="text-gray-700 ml-8">{event.location}</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-methodist-blue mr-3" />
                    <span className="font-semibold text-gray-900">Who Can Attend</span>
                  </div>
                  <p className="text-gray-700 ml-8">Everyone is welcome!</p>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/#contact">
                  <Button 
                    className="w-full bg-methodist-blue hover:bg-methodist-blue/90 text-white py-6 text-lg font-semibold"
                    data-testid="button-rsvp"
                  >
                    RSVP or Get More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
