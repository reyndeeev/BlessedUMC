import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Handshake } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-4xl font-bold text-methodist-blue mb-6">Our Story & Mission</h2>
            <p className="text-lg text-warm-gray mb-6 leading-relaxed">
              For over 75 years, Blessed United Methodist Church has been a beacon of hope and love in our community. Founded in 1948, we've grown from a small congregation meeting in homes to a vibrant church family of over 800 members.
            </p>
            <p className="text-lg text-warm-gray mb-8 leading-relaxed">
              Our mission is simple: to make disciples of Jesus Christ for the transformation of the world. We believe in open hearts, open minds, and open doors - welcoming all people to experience God's grace and love.
            </p>
            
            {/* Mission Values */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-methodist-blue rounded-full flex items-center justify-center">
                  <Heart className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">Compassionate Care</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warm-gold rounded-full flex items-center justify-center">
                  <Handshake className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">Community Service</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-soft-green rounded-full flex items-center justify-center">
                  <BookOpen className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">Biblical Teaching</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-methodist-blue rounded-full flex items-center justify-center">
                  <Users className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">Inclusive Fellowship</span>
              </div>
            </div>

            <Button 
              className="bg-methodist-blue text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
              data-testid="button-learn-more"
            >
              Learn More About Us
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500" 
              alt="Diverse congregation in worship" 
              className="rounded-xl shadow-lg w-full h-64 object-cover"
              data-testid="image-congregation"
            />
            
            <img 
              src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Prayer circle showing community" 
              className="rounded-xl shadow-lg w-full h-48 object-cover mt-4"
              data-testid="image-prayer-circle"
            />
            
            <img 
              src="https://images.unsplash.com/photo-1520637836862-4d197d17c7a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Church exterior architecture" 
              className="rounded-xl shadow-lg w-full h-48 object-cover"
              data-testid="image-church-exterior"
            />
            
            <img 
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500" 
              alt="Community service and outreach" 
              className="rounded-xl shadow-lg w-full h-64 object-cover mt-4"
              data-testid="image-community-service"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
