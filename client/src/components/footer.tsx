import { Cross, Facebook, Instagram, Youtube, Podcast, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-methodist-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Cross className="text-methodist-blue text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold">Blessed UMC</h3>
                <p className="text-sm text-gray-300">United Methodist Church</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              A welcoming community where faith grows, hearts heal, and everyone belongs in God's love.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://www.facebook.com/profile.php?id=61556573281040', '_blank')}
                className="text-gray-300 hover:text-warm-gold transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="text-xl" />
              </button>
              <button
                onClick={() => window.open('https://www.instagram.com/blessedumc/', '_blank')}
                className="text-gray-300 hover:text-warm-gold transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="text-xl" />
              </button>
              <button
                onClick={() => window.open('https://www.youtube.com/@blessedumc', '_blank')}
                className="text-gray-300 hover:text-warm-gold transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="text-xl" />
              </button>
              <button
                onClick={() => window.open('https://open.spotify.com/show/1HvXzv9OQgpEhfbA05HshK?si=c1ed91207dd24a58', '_blank')}
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
                  onClick={() => scrollToSection('about')}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-about"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('worship')}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-worship"
                >
                  Worship Times
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('ministries')}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-ministries"
                >
                  Ministries
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('events')}
                  className="hover:text-warm-gold transition-colors"
                  data-testid="footer-link-events"
                >
                  Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
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
            <h4 className="text-lg font-heading font-bold mb-4">Worship Times</h4>
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

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="mt-1 text-warm-gold" size={16} />
                <div>
                  <p>69 Don Placido Campos Ave., San Jose</p>
                  <p>Dasmariñas, Cavite</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-warm-gold" size={16} />
                <p>(555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="text-warm-gold" size={16} />
                <p>info@blessedumc.org</p>
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
