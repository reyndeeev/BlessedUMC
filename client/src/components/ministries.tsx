import { Baby, Users, BookOpen, Handshake, Music, Home } from "lucide-react";

export default function Ministries() {
  const ministries = [
    {
      title: "Children's Ministry",
      description: "Nurturing young hearts with age-appropriate Bible lessons, crafts, games, and fellowship for children from nursery through 5-11 yrs old",
      icon: Baby,
      color: "bg-warm-gold",
      programs: [
        "Sunday School (9:15 AM)",
        "Children's Church",
        "Vaction Church School",
        "Family Events"
      ]
    },
    {
      title: "Youth Ministry",
      description: "Empowering teenagers to develop lasting faith through engaging programs, mission trips, and authentic community.",
      icon: Users,
      color: "bg-methodist-blue",
      programs: [
        "Wednesday Youth Group",
        "Mission Trips",
        "Youth Band",
        "Confirmation Classes"
      ]
    },
    {
      title: "Adult Education",
      description: "Deepen your faith through Bible studies, discussion groups, and educational opportunities for spiritual growth.",
      icon: BookOpen,
      color: "bg-soft-green",
      programs: [
        "Sunday School Classes",
        "Bible Study Groups",
        "Book Clubs",
        "Retreats & Workshops"
      ]
    },
    {
      title: "Community Outreach",
      description: "Serving our community through food pantries, homeless shelter support, and various local mission initiatives.",
      icon: Handshake,
      color: "bg-warm-gold",
      programs: [
        "Food Pantry Ministry",
        "Homeless Shelter Meals",
        "Community Garden",
        "Prison Ministry"
      ]
    },
    {
      title: "Music Ministry",
      description: "Share your musical gifts through our various ensembles and worship teams that enhance our services.",
      icon: Music,
      color: "bg-methodist-blue",
      programs: [
        "Adult Choir",
        "Contemporary Band",
        "Handbell Choir",
        "Children's Choir"
      ]
    },
    {
      title: "Small Groups",
      description: "Build deeper relationships and grow in faith through intimate small group settings in homes throughout our community.",
      icon: Home,
      color: "bg-soft-green",
      programs: [
        "Home Bible Studies",
        "Support Groups",
        "Men's & Women's Groups",
        "Young Adult Ministry"
      ]
    }
  ];

  return (
    <section id="ministries" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-methodist-blue mb-4">Ministries & Programs</h2>
          <p className="text-xl text-warm-gray max-w-3xl mx-auto">
            Discover opportunities to grow in faith, serve others, and build meaningful connections within our church family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => {
            const IconComponent = ministry.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${ministry.color} rounded-full flex items-center justify-center mb-4`}>
                  <IconComponent className="text-white text-2xl" />
                </div>
                <h3 className="font-heading text-xl font-bold text-methodist-blue mb-3">{ministry.title}</h3>
                <p className="text-warm-gray mb-4">
                  {ministry.description}
                </p>
                <ul className="text-sm text-warm-gray space-y-1 mb-4">
                  {ministry.programs.map((program, programIndex) => (
                    <li key={programIndex}>• {program}</li>
                  ))}
                </ul>
                <button 
                  className="text-methodist-blue hover:text-warm-gold font-medium"
                  data-testid={`button-ministry-${index}`}
                >
                  Learn More →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
