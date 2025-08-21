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
    title: "Costly Commitment to Kingdom Values",
    speaker: "Rev. John B. Manalo",
    thumbnail: "https://media.discordapp.net/attachments/948276718609772597/1408040776075841566/532190189_122239032812219109_6637788950243137293_n.jpg?ex=68a84ba9&is=68a6fa29&hm=d19c78b79064d3d5d6627aa61d952856c7d5d315f81b20fbf846523b1e3e6985&=&format=webp",
    videoUrl: "https://www.facebook.com/61556573281040/videos/1723558745031243",
    date: "Sunday, Aug 17"
  },
  {
    id: "2", 
    title: "Watchful and Trusting Stewardship",
    speaker: "Rev. John",
    thumbnail: "https://cdn.discordapp.com/attachments/948276718609772597/1408048819505074277/D127B3DF-2D9E-4F94-95D6-BA1ABCBCD0A4.png?ex=68a85326&is=68a701a6&hm=6046a7fa2c986ae9d52d5beae13dfdeffd20df5147c452c43e5376310cd509ff&",
    videoUrl: "https://www.facebook.com/61556573281040/videos/1111171580908275",
    date: "Sunday, Aug 10"
  },
  {
    id: "3",
    title: "Guarding the Heart from Greed", 
    speaker: "Rev. John",
    thumbnail: "https://media.discordapp.net/attachments/948276718609772597/1408051272069939222/99046FBD-FC7B-4030-8B28-675C5A6F864F.png?ex=68a8556f&is=68a703ef&hm=33e24421001ca43c90e5e2e719858b33acc9eaabdfcae918a931164856002173&=&format=webp&quality=lossless",
    videoUrl: "https://www.facebook.com/61556573281040/videos/2488379231495004",
    date: "Sunday, Aug 3"
  },
  {
    id: "4",
    title: "Lord Teach Us To Pray",
    speaker: "Rev. John", 
    thumbnail: "https://cdn.discordapp.com/attachments/948276718609772597/1408052398395621506/523382685_122235131786219109_1230725115846883199_n.jpg?ex=68a8567c&is=68a704fc&hm=c59322284cd6abc6113e112cabb625f201849aa5c26f45297953c47492b611bb",
    videoUrl: "https://www.facebook.com/61556573281040/videos/1057791889832504",
    date: "Sunday, July 27"
  }
];

export default function SermonCatchup() {
  const handleSermonClick = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  const handleViewMore = () => {
    window.open("https://www.facebook.com/profile.php?id=61556573281040&sk=videos", "_blank");
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
              Missed a Sunday service? No problem! Watch our recent messages and stay connected with God.
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
                    Costly Commitment to Kingdom Values
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