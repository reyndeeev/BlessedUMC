import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Sermon } from "@shared/schema";

export default function SermonCatchup() {
  // Fetch featured sermon
  const { data: featuredSermon, isLoading: featuredLoading, error: featuredError } = useQuery<Sermon | null>({
    queryKey: ["/api", "sermons", "featured"],
    queryFn: async () => {
      const response = await fetch('/api/sermons/featured');
      if (!response.ok) {
        throw new Error(`Failed to fetch featured sermon: ${response.status}`);
      }
      return response.json();
    },
  });

  // Fetch recent sermons
  const { data: recentSermons = [], isLoading: recentsLoading, error: recentsError } = useQuery<Sermon[]>({
    queryKey: ["/api", "sermons", "recent"],
    queryFn: async () => {
      const response = await fetch('/api/sermons/recent?limit=4');
      if (!response.ok) {
        throw new Error(`Failed to fetch recent sermons: ${response.status}`);
      }
      return response.json();
    },
  });

  const isLoading = featuredLoading || recentsLoading;
  const hasError = featuredError || recentsError;

  // Use featured sermon if available, otherwise fall back to first recent sermon
  const displaySermon = featuredSermon || recentSermons[0];
  const additionalSermons = featuredSermon ? recentSermons.slice(0, 3) : recentSermons.slice(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const getVideoUrl = (sermon: Sermon) => {
    return sermon.videoUrl || '#';
  };

  const getDisplayImage = (sermon: Sermon) => {
    return sermon.thumbnailUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop';
  };
  const handleSermonClick = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  const handleViewMore = () => {
    window.open(
      "https://www.facebook.com/profile.php?id=61556573281040&sk=videos",
      "_blank",
    );
  };

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100"
      id="sermons"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Planetshakers-style section header */}
        <div className="text-center mb-16">
          <h3 className="font-heading text-sm font-bold tracking-wide text-methodist-blue uppercase mb-4">
            Latest Message
          </h3>
          <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Catch up from Sunday
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss the powerful messages that are transforming lives. Watch
            our latest sermons and be inspired.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Loading skeleton */}
            <div className="lg:w-1/3 flex flex-col justify-center">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="lg:w-2/3">
              <div className="h-80 lg:h-96 bg-gray-200 rounded-2xl mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        ) : hasError ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200">
            <h3 className="text-2xl font-heading font-bold text-red-600 mb-4">
              Unable to Load Sermons
            </h3>
            <p className="text-red-500 mb-4">
              We're experiencing technical difficulties. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-reload-sermons"
            >
              Refresh Page
            </Button>
          </div>
        ) : !displaySermon ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-heading font-bold text-gray-600 mb-4">
              No Sermons Available
            </h3>
            <p className="text-gray-500">
              Check back soon for the latest messages!
            </p>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side - Enhanced Description */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Never Miss a Message
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Stay connected with our church family through powerful,
                life-changing messages that speak directly to your heart and
                circumstances.
              </p>
              <Button
                onClick={handleViewMore}
                className="bg-methodist-blue hover:bg-methodist-blue/90 text-white px-8 py-4 rounded-full text-lg font-bold w-full transition-all transform hover:scale-105 shadow-lg"
                data-testid="button-view-more-sermons"
              >
                Watch More Sermons
              </Button>
            </div>
          </div>

          {/* Right side - Sermon Grid */}
          <div className="lg:w-2/3">
            {/* Featured Sermon - Planetshakers style */}
            <div className="mb-8">
              <div
                className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl cursor-pointer group h-80 lg:h-96 border border-gray-200"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%), url('${getDisplayImage(displaySermon)}')`,
                }}
                onClick={() => handleSermonClick(getVideoUrl(displaySermon))}
                data-testid={`featured-sermon-${displaySermon?.id}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-full p-6 group-hover:bg-opacity-25 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  ● {featuredSermon ? 'Featured' : 'New'}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8">
                  <div className="text-warm-gold text-3xl lg:text-5xl font-black mb-3 font-heading tracking-tight">
                    {displaySermon?.title}
                  </div>
                  <div className="text-white text-xl font-medium">
                    {displaySermon?.pastor} • {displaySermon?.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Sermon Thumbnails Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalSermons.length > 0 && additionalSermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="group cursor-pointer"
                  onClick={() => handleSermonClick(getVideoUrl(sermon))}
                  data-testid={`sermon-${sermon.id}`}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="relative h-40 lg:h-48">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.5) 0%, rgba(0, 0, 0, 0.2) 100%), url('${getDisplayImage(sermon)}')`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 group-hover:bg-opacity-30 group-hover:scale-110 transition-all duration-300">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 bg-methodist-blue text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-heading font-bold text-gray-900 mb-2 text-lg leading-tight">
                        {sermon.title}
                      </h4>
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        {sermon.pastor}
                      </p>
                      <p className="text-gray-400 text-xs">{sermon.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
