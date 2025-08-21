import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface SermonData {
  id: string;
  title: string;
  speaker: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
}

// Mock sermon data - replace with real data from your church
const recentSermons: SermonData[] = [
  {
    id: "1",
    title: "We Win!",
    speaker: "Pastor Daniel",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop&crop=face",
    videoUrl: "https://www.facebook.com/BlessedUMC",
    date: "Sunday, Dec 15"
  },
  {
    id: "2", 
    title: "The Power Of Waiting On The Lord",
    speaker: "Pastor John",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=225&fit=crop&crop=face",
    videoUrl: "https://www.facebook.com/BlessedUMC",
    date: "Sunday, Dec 8"
  },
  {
    id: "3",
    title: "The Power Of Your Voice", 
    speaker: "Pastor John",
    thumbnail: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=225&fit=crop&crop=face",
    videoUrl: "https://www.facebook.com/BlessedUMC",
    date: "Sunday, Dec 1"
  },
  {
    id: "4",
    title: "The Lord Of Heaven's Armies",
    speaker: "Pastor Daniel", 
    thumbnail: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=225&fit=crop&crop=face",
    videoUrl: "https://www.facebook.com/BlessedUMC",
    date: "Sunday, Nov 24"
  }
];

export default function SermonCatchup() {
  const handleSermonClick = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  const handleViewMore = () => {
    window.open("https://www.facebook.com/BlessedUMC/videos", "_blank");
  };

  return (
    <section className="py-16 bg-gray-100" id="sermons">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Title and Description */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              Catch up from the previous week.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Missed a Sunday service? No problem! Watch our recent messages and stay connected with what God is doing in our church family.
            </p>
            <Button
              onClick={handleViewMore}
              className="bg-methodist-blue hover:bg-methodist-blue/90 text-white px-8 py-3 text-lg font-semibold w-fit"
              data-testid="button-view-more-sermons"
            >
              View More Sermons
            </Button>
          </div>

          {/* Right side - Sermon Grid */}
          <div className="lg:w-2/3">
            {/* Featured Sermon */}
            <div className="mb-6">
              <div
                className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-lg cursor-pointer group h-64 lg:h-80"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%), url('${recentSermons[0].thumbnail}')`
                }}
                onClick={() => handleSermonClick(recentSermons[0].videoUrl)}
                data-testid={`featured-sermon-${recentSermons[0].id}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 group-hover:bg-opacity-30 transition-all duration-300">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6">
                  <div className="text-warm-gold text-2xl lg:text-4xl font-bold mb-2 font-heading">
                    WE WIN!
                  </div>
                  <div className="text-white text-lg">
                    {recentSermons[0].speaker} | {recentSermons[0].date}
                  </div>
                </div>
              </div>
            </div>

            {/* Sermon Thumbnails Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSermons.slice(1).map((sermon) => (
                <div
                  key={sermon.id}
                  className="group cursor-pointer"
                  onClick={() => handleSermonClick(sermon.videoUrl)}
                  data-testid={`sermon-${sermon.id}`}
                >
                  <div className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-md h-32 lg:h-40 mb-3">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%), url('${sermon.thumbnail}')`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-warm-gold text-methodist-blue text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                      {sermon.speaker} | {sermon.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sermon.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}