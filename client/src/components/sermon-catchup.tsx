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
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100" id="sermons">
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
            Don't miss the powerful messages that are transforming lives. Watch our latest sermons and be inspired.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side - Enhanced Description */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Never Miss a Message
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Stay connected with our church family through powerful, life-changing messages that speak directly to your heart and circumstances.
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
                  backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%), url('${recentSermons[0].thumbnail}')`
                }}
                onClick={() => handleSermonClick(recentSermons[0].videoUrl)}
                data-testid={`featured-sermon-${recentSermons[0].id}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-full p-6 group-hover:bg-opacity-25 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  ● Live
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8">
                  <div className="text-warm-gold text-3xl lg:text-5xl font-black mb-3 font-heading tracking-tight">
                    Costly Commitment to Kingdom Values
                  </div>
                  <div className="text-white text-xl font-medium">
                    {recentSermons[0].speaker} • {recentSermons[0].date}
                  </div>
                </div>
              </div>
            </div>

            {/* Sermon Thumbnails Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSermons.slice(1).map((sermon) => (
                <div
                  key={sermon.id}
                  className="group cursor-pointer"
                  onClick={() => handleSermonClick(sermon.videoUrl)}
                  data-testid={`sermon-${sermon.id}`}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="relative h-40 lg:h-48">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.5) 0%, rgba(0, 0, 0, 0.2) 100%), url('${sermon.thumbnail}')`
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
                        {sermon.speaker}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {sermon.date}
                      </p>
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