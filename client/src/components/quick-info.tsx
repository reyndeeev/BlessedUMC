import { Clock, MapPin, Phone, Navigation, Calendar } from "lucide-react";

export default function QuickInfo() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Worship Times */}
          <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-methodist-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-white text-2xl" />
            </div>
            <h3 className="font-heading text-xl font-bold text-methodist-blue mb-3">
              Worship Times
            </h3>
            <div className="space-y-2 text-warm-gray">
              <p>
                <strong>Sunday Worship Service:</strong> 9:15 AM
              </p>
              <p>
                <strong>Moment Devotion Prayer:</strong> 11:00 AM
              </p>
              <p>
                <strong></strong>
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-warm-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white text-2xl" />
            </div>
            <h3 className="font-heading text-xl font-bold text-methodist-blue mb-3">
              Find Us
            </h3>
            <div className="text-warm-gray">
              <p>123 Faith Avenue</p>
              <p>Dasmariñas, Cavite</p>
              <button
                className="text-methodist-blue hover:text-warm-gold mt-2 font-medium flex items-center mx-auto"
                data-testid="button-directions"
              >
                <Navigation className="mr-1 h-4 w-4" />
                Get Directions
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-soft-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white text-2xl" />
            </div>
            <h3 className="font-heading text-xl font-bold text-methodist-blue mb-3">
              Contact Us
            </h3>
            <div className="space-y-2 text-warm-gray">
              <p className="flex items-center justify-center">
                <Phone className="mr-2 h-4 w-4" />
                (555) 123-4567
              </p>
              <p className="flex items-center justify-center">
                <span className="mr-2">✉</span>
                info@blessedumc.org
              </p>
              <button
                className="text-methodist-blue hover:text-warm-gold mt-2 font-medium"
                data-testid="button-send-message"
              >
                Send Message
              </button>
            </div>
          </div>

          {/* Regular Activities */}
          <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-methodist-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-white text-2xl" />
            </div>
            <h3 className="font-heading text-xl font-bold text-methodist-blue mb-3">
              Weekly Activities
            </h3>
            <div className="space-y-2 text-warm-gray">
              <p>
                <strong>Bible Study:</strong> Wednesday 7:00 PM
              </p>
              <p>
                <strong>Youth Group:</strong> Friday 6:00 PM
              </p>
              <p>
                <strong>Prayer Meeting:</strong> Saturday 6:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
