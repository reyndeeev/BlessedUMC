import { Clock, MapPin, Phone, Navigation, Calendar } from "lucide-react";

export default function QuickInfo() {
  return (
    <section className="py-16 bg-white" data-testid="quick-info-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Worship Times */}
          <div
            className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            data-testid="quick-info-worship"
          >
            <div className="w-16 h-16 bg-methodist-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-white text-2xl" />
            </div>
            <h3
              className="font-heading text-xl font-bold text-methodist-blue mb-3"
              data-testid="quick-info-worship-title"
            >
              Worship Times
            </h3>
            <div className="space-y-2 text-warm-gray">
              <p data-testid="quick-info-worship-sunday">
                <strong>Sunday Worship Service:</strong> 9:15 AM
              </p>
            </div>
          </div>

          {/* Weekly Activities */}
          <div
            className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            data-testid="quick-info-activities"
          >
            <div className="w-16 h-16 bg-methodist-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-white text-2xl" />
            </div>
            <h3
              className="font-heading text-xl font-bold text-methodist-blue mb-3"
              data-testid="quick-info-activities-title"
            >
              Weekly Activities
            </h3>
            <div className="space-y-2 text-warm-gray">
              <p data-testid="activity-sunday-school">
                <strong>Sunday School:</strong> Sunday After Worship Service
              </p>
              <p data-testid="activity-home-visitation">
                <strong>Home Visitation:</strong> Wednesday
              </p>
              <p data-testid="activity-bible-engagement">
                <strong>Bible Engagement Driven:</strong> Friday 7:45 PM
              </p>
              <p data-testid="activity-emanuel-mission">
                <strong>Emanuel Mission For Evangelism:</strong> Saturday 9:00 AM
              </p>
            </div>
          </div>

          {/* Location */}
          <div
            className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            data-testid="quick-info-location"
          >
            <div className="w-16 h-16 bg-warm-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white text-2xl" />
            </div>
            <h3
              className="font-heading text-xl font-bold text-methodist-blue mb-3"
              data-testid="quick-info-location-title"
            >
              Find Us
            </h3>
            <div className="text-warm-gray">
              <p data-testid="location-address-line1">
                69 Don Placido Campos Ave., San Jose
              </p>
              <p data-testid="location-address-line2">Dasmariñas, Cavite</p>
              <button
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/PxJxg8ssYJN5hBERA",
                    "_blank"
                  )
                }
                className="text-methodist-blue hover:text-warm-gold mt-2 font-medium flex items-center mx-auto"
                data-testid="button-directions"
              >
                <Navigation className="mr-1 h-4 w-4" />
                Get Directions
              </button>
            </div>
          </div>

          {/* Contact */}
          <div
            id="contact-info"
            className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            data-testid="quick-info-contact"
          >
            <div className="w-16 h-16 bg-soft-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white text-2xl" />
            </div>
            <h3
              className="font-heading text-xl font-bold text-methodist-blue mb-3"
              data-testid="quick-info-contact-title"
            >
              Contact Us
            </h3>
            <div className="space-y-2 text-warm-gray">
              <p
                className="flex items-center justify-center"
                data-testid="contact-email"
              >
                <span className="mr-2">✉</span>
                iamblessedchurch@gmail.com
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("contact-info")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-methodist-blue hover:text-warm-gold mt-2 font-medium"
                data-testid="button-send-message"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
