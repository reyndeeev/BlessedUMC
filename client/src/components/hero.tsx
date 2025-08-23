import React from 'react';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Heart, Users, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';

export default function Hero() {
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/attached_assets/image_1755699549465.png')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to
            <span className="block text-warm-gold">
              Blessed UMC
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            A place where faith grows, hearts heal, and everyone belongs in God's love
          </p>
        </div>

        {/* Service Times Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
            <div className="flex items-center gap-3">
              <Calendar className="text-warm-gold" size={24} />
              <div>
                <p className="font-semibold">Sunday Worship</p>
                <p className="text-gray-200">Every Sunday</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-warm-gold" size={24} />
              <div>
                <p className="font-semibold">9:00 AM</p>
                <p className="text-gray-200">Service Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-warm-gold" size={24} />
              <div>
                <p className="font-semibold">In-Person</p>
                <p className="text-gray-200">Join us live</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={() => scrollToSection('about')}
            size="lg"
            className="bg-warm-gold hover:bg-warm-gold/90 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
          >
            <Heart className="mr-2" size={20} />
            Learn More About Us
          </Button>

          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            size="lg"
            className="border-2 border-white/50 text-white hover:bg-white/20 backdrop-blur-md px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
          >
            <Users className="mr-2" size={20} />
            Connect With Us
          </Button>
        </div>

        {/* Facebook Integration */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => window.open('https://www.facebook.com/profile.php?id=61556573281040', '_blank')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 transition-all duration-300 hover:scale-105"
          >
            Follow Our Main Page
          </Button>

          <Button
            onClick={() => window.open('https://www.facebook.com/blessedumyf01', '_blank')}
            className="bg-warm-gold/20 hover:bg-warm-gold/30 backdrop-blur-md border border-warm-gold/50 text-white px-6 py-3 transition-all duration-300 hover:scale-105"
          >
            Follow Our Youth (UMYF)
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={() => scrollToSection('about')}
          className="cursor-pointer animate-bounce"
        >
          <ChevronDown className="text-white/70 hover:text-white transition-colors" size={32} />
        </div>
      </div>
    </div>
  );
}