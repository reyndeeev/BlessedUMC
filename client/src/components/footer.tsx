import {
  Facebook,
  Podcast,
  MapPin,
  Mail,
  X,
} from "lucide-react";
import Logo from "./logo";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-methodist-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Church Info */}
          <div>
            <div className="mb-4">
              <Logo variant="footer" size="md" />
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              A welcoming community where faith grows, hearts heal, and everyone
              belongs in God's love.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/profile.php?id=61556573281040",
                    "_blank",
                  )
                }
                className="text-gray-300 hover:text-warm-gold transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="text-xl" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://open.spotify.com/show/1HvXzv9OQgpEhfbA05HshK?si=c1ed91207dd24a58",
                    "_blank",
                  )
                }
                className="text-gray-300 hover:text-warm-gold transition-colors"
                data-testid="link-podcast"
              >
                <Podcast className="text-xl" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-about"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("worship")}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-worship"
                >
                  Worship Times
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("ministries")}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-ministries"
                >
                  Ministries
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("events")}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-events"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-giving"
                >
                  Online Giving
                </button>
              </li>
            </ul>
          </div>

          {/* Worship Times */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">
              Worship Times
            </h4>
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-medium text-white">Sunday Worship Service</p>
                <p className="text-sm">9:15 AM</p>
              </div>
              <div>
                <p className="font-medium text-white"></p>
                <p className="text-sm"></p>
              </div>
              <div>
                <p className="font-medium text-white"></p>
                <p className="text-sm"></p>
              </div>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">
              Visit Us
            </h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="mt-1 text-warm-gold" size={16} />
                <div>
                  <p>69 Don Placido Campos Ave., San Jose</p>
                  <p>Dasmariñas, Cavite</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="text-warm-gold" size={16} />
                <p>iamblessedchurch@gmail.com</p>
              </div>
              
              {/* Google Maps Embed */}
              <div className="mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.8519!2d120.9365!3d14.3294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDE5JzQ1LjgiTiAxMjDCsDU2JzExLjQiRQ!5e0!3m2!1sen!2sph!4v1234567890"
                  width="100%"
                  height="150"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Blessed United Methodist Church Location"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-600 pt-8 text-center text-gray-300">
          <p>
            &copy; 2025 Blessed United Methodist Church. All rights reserved.
          </p>
          <p className="mt-2 text-sm">
            Built with love for our church community
          </p>
        </div>
      </div>
    </footer>
  );
}