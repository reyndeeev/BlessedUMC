import { Facebook, Podcast, MapPin, Mail } from "lucide-react";
import Logo from "./logo";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const headerOffset = 80; // height of fixed header
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 1000; // longer duration for smoothness
    let start: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      const ease = easeInOutCubic(percent);
      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
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
                    "_blank"
                  )
                }
                className="text-gray-300 hover:text-warm-gold transition-colors"
              >
                <Facebook className="text-xl" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://open.spotify.com/show/1HvXzv9OQgpEhfbA05HshK?si=c1ed91207dd24a58",
                    "_blank"
                  )
                }
                className="text-gray-300 hover:text-warm-gold transition-colors"
              >
                <Podcast className="text-xl" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              {["about", "worship", "ministries", "events", "contact", "giving"].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="hover:text-warm-gold transition-colors"
                  >
                    {id === "giving" ? "Online Giving" : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Worship Times */}
          <div id="worship-footer">
            <h4 className="text-lg font-heading font-bold mb-4">
              Worship Times
            </h4>
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-medium text-white">Sunday Worship Service</p>
                <p className="text-sm">9:15 AM</p>
              </div>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">Visit Us</h4>
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
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-600 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Blessed United Methodist Church. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with love for our church community</p>
        </div>
      </div>
    </footer>
  );
}
