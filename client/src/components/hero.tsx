import { Button } from "@/components/ui/button";
import { CalendarPlus, Play, ChevronDown } from "lucide-react";

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
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Welcome Home to <span className="font-extrabold text-[#d40b0b]">
        BLESSED UMC
</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto leading-relaxed">
          A community where faith grows, hearts heal, and everyone belongs. Join
          us in worship, fellowship, and service as we follow Christ together.
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
            className="border-2 border-yellow-400 text-yellow-400 bg-black bg-opacity-30 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all"
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
