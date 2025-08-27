import { Button } from "@/components/ui/button";
import { CalendarPlus, Play, ChevronDown, Headphones, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 800;
    let start: number | null = null;

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      const ease = easeInOutQuad(percent);
      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  };
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center"
    >
      {/* Church interior background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.8) 0%, rgba(60, 30, 120, 0.6) 25%, rgba(0, 0, 0, 0.7) 50%, rgba(120, 60, 30, 0.5) 75%, rgba(27, 54, 93, 0.8) 100%), radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%), url('<https://i.postimg.cc/Nf3vcGHq/bumcfrontpage.jpg')`,
        }}
      />
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
        {/* Planetshakers-style bold headline */}
        <div className="mb-8">
          <h2 className="font-heading text-lg md:text-xl font-medium tracking-wide text-warm-gold uppercase mb-4">
            Welcome to
          </h2>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-2 leading-none tracking-tight">
            BLESSED
          </h1>
          <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-black mb-6 leading-none tracking-tight text-blue-100">
            UNITED METHODIST CHURCH
          </h2>
          <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-light tracking-wide text-blue-100">
            Empowering Generations To Win Generations
          </p>
        </div>

        <p className="text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
          Where faith grows, hearts heal, and everyone belongs. Join us in
          worship, fellowship, and service as we follow Christ together.
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
            Visit Our Facebook Page
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
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Plan Your Visit
          </button>
          <button
            onClick={() =>
              window.open(
                "https://www.facebook.com/profile.php?id=61556573281040",
                "_blank",
              )
            }
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Give Online
          </button>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Prayer Requests
          </button>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-methodist-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </section>
  );
}