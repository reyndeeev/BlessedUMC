import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Handshake, CheckCircle, Star } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Planetshakers style */}
        <div className="text-center mb-16">
          <h3 className="font-heading text-sm font-bold tracking-wide text-methodist-blue uppercase mb-4">
            About Blessed UMC
          </h3>
          <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Our Story & Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building God's kingdom through authentic community, powerful worship, and radical love.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                30+ Years of Faith & Service
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Since 1994, Blessed United Methodist Church has been transforming lives and strengthening our community through the power of God's love. We've grown from humble beginnings into a thriving church family committed to authentic worship and radical service.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is clear: <span className="font-semibold text-methodist-blue">to make disciples of Jesus Christ for the transformation of the world.</span> We believe in open hearts, open minds, and open doors - creating space where everyone can encounter God's amazing grace.
              </p>

              {/* Core Values - Enhanced Design */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-methodist-blue rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="text-white w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Compassionate Care
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors">
                  <div className="w-10 h-10 bg-warm-gold rounded-full flex items-center justify-center shadow-lg">
                    <Handshake className="text-white w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Community Service
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="w-10 h-10 bg-soft-green rounded-full flex items-center justify-center shadow-lg">
                    <BookOpen className="text-white w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Biblical Teaching
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-methodist-blue rounded-full flex items-center justify-center shadow-lg">
                    <Users className="text-white w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Inclusive Fellowship
                  </span>
                </div>
              </div>

              <Link href="/about">
                <Button
                  className="bg-methodist-blue text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-methodist-blue/90 transition-all transform hover:scale-105 shadow-lg w-full"
                  data-testid="button-learn-more"
                >
                  Discover Our Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Grid - Modern Layout */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <img
                src="https://raw.githubusercontent.com/reyndeeev/BlessedUMC/refs/heads/main/attached_assets/images/abou2.jpg"
                alt="Diverse congregation in worship"
                className="rounded-2xl shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                data-testid="image-congregation"
              />
              
              {/* Stats Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <Star className="w-6 h-6 text-warm-gold" />
                  <span className="text-2xl font-black text-methodist-blue">30+</span>
                </div>
                <p className="text-gray-600 font-medium">Years of faithful service to our community</p>
              </div>
            </div>
            
            <div className="space-y-6 pt-8">
              <img
                src="https://raw.githubusercontent.com/reyndeeev/BlessedUMC/refs/heads/main/attached_assets/images/about1.jpg"
                alt="Church community serving together"
                className="rounded-2xl shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                data-testid="image-community"
              />

              {/* Mission Statement Card */}
              <div className="bg-methodist-blue rounded-2xl p-6 shadow-xl text-white">
                <CheckCircle className="w-6 h-6 text-warm-gold mb-3" />
                <p className="font-bold text-lg leading-tight">
                  "Open hearts, open minds, open doors"
                </p>
                <p className="text-blue-100 text-sm mt-2">Our Methodist motto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}