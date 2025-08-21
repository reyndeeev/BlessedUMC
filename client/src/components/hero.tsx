import { Button } from "@/components/ui/button";
import { CalendarPlus, Play, ChevronDown, Headphones } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center"
    >
      {/* Church interior background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.8) 0%, rgba(60, 30, 120, 0.6) 25%, rgba(0, 0, 0, 0.7) 50%, rgba(120, 60, 30, 0.5) 75%, rgba(27, 54, 93, 0.8) 100%), radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%), url('https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/480849794_122203836704219109_1468100116698178807_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeEkn9oBRIB09U6avg7imh4W8hMDmHpBTp7yEwOYekFOnub4Xk1cBBvqIByM9gT-5TlPxwKqF8s6-FnaRX11tntW&_nc_ohc=O8Jp7py7RxAQ7kNvwHJ2Bxs&_nc_oc=Adm-seNLqZxKkdBx9Mn9ed5SoVzVz9nG9bTom16nzLOt-6LE_l6SEma7el2CQcHWIGo&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=tQL4pOFtfub8zNtHnb86hA&oh=00_AfWld6-gWTIUoI3HP6kOGByEB8j9Pc2sfoi3CcfouI49QQ&oe=68AB7671')`,
        }}
      />
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
        {/* Planetshakers-style bold headline */}
        <div className="mb-8">
          <h2 className="font-heading text-lg md:text-xl font-medium tracking-wide text-warm-gold uppercase mb-4">
            Church
          </h2>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tight">
            BLESSED UNITED METHODIST CHURCH
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-light tracking-wide text-blue-100">
            Empowering Generations To Win Generations
          </p>
        </div>
        
        <p className="text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
          Where faith grows, hearts heal, and everyone belongs. Join us in worship, fellowship, and service as we follow Christ together.
        </p>
        
        {/* Planetshakers-style action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            onClick={() =>
              window.open(
                "https://www.facebook.com/profile.php?id=61556573281040",
                "_blank",
              )
            }
            className="bg-white text-methodist-blue px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            data-testid="button-watch-online"
          >
            <Play className="mr-3 h-6 w-6" />
            Watch Live Service
          </Button>
          
          <Button
            onClick={() =>
              window.open(
                "https://open.spotify.com/show/1HvXzv9OQgpEhfbA05HshK?si=c1ed91207dd24a58",
                "_blank",
              )
            }
            variant="outline"
            className="border-3 border-warm-gold text-warm-gold bg-transparent px-10 py-5 rounded-full text-lg font-bold hover:bg-warm-gold hover:text-methodist-blue transition-all transform hover:scale-105"
            data-testid="button-mdp-hero"
          >
            <Headphones className="mr-3 h-6 w-6" />
            Listen to MDP
          </Button>
        </div>
        
        {/* Quick links - Planetshakers style */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm font-medium">
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Plan Your Visit
          </button>
          <button 
            onClick={() => window.open('https://www.facebook.com/profile.php?id=61556573281040', '_blank')}
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Give Online
          </button>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Prayer Requests
          </button>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Contact Us
          </button>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="text-2xl" />
      </div>
    </section>
  );
}
