import { Button } from "@/components/ui/button";
import { CalendarPlus, Play, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      {/* Church interior background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(27, 54, 93, 0.4), rgba(27, 54, 93, 0.4)), url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`
        }}
      />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Welcome Home to <span className="text-warm-gold">Blessed UMC</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto leading-relaxed">
          A community where faith grows, hearts heal, and everyone belongs. Join us in worship, fellowship, and service as we follow Christ together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-warm-gold text-methodist-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
            data-testid="button-plan-visit-hero"
          >
            <CalendarPlus className="mr-2 h-5 w-5" />
            Plan Your Visit
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-methodist-blue transition-all"
            data-testid="button-watch-online"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Online
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="text-2xl" />
      </div>
    </section>
  );
}
