import { Music, Guitar, Clock, BookOpen, Check } from "lucide-react";

export default function Worship() {
  return (
    <section id="worship" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-methodist-blue mb-4">Worship With Us</h2>
          <p className="text-xl text-warm-gray max-w-3xl mx-auto">
            Join us for meaningful worship with contemporary praise music in a welcoming, family-friendly atmosphere.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          {/* Contemporary Service */}
          <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-warm-gold rounded-full flex items-center justify-center mr-4">
                <Guitar className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-methodist-blue">Sunday Worship Service</h3>
                <p className="text-warm-gold font-medium">Sundays at 9:15 AM</p>
              </div>
            </div>
            <p className="text-warm-gray mb-6 leading-relaxed">
              Join us for energetic worship with modern praise music, casual atmosphere, and interactive elements. Our worship service welcomes families and offers engaging worship for all ages.
            </p>
            <ul className="space-y-2 text-warm-gray mb-6">
              <li className="flex items-center">
                <Check className="text-soft-green mr-2 h-4 w-4" />
                Modern praise and worship music
              </li>
              <li className="flex items-center">
                <Check className="text-soft-green mr-2 h-4 w-4" />
                Casual, family-friendly atmosphere
              </li>
              <li className="flex items-center">
                <Check className="text-soft-green mr-2 h-4 w-4" />
                Live band and multimedia
              </li>
              <li className="flex items-center">
                <Check className="text-soft-green mr-2 h-4 w-4" />
                
              </li>
            </ul>
          </div>
        </div>

        {/* Midweek Service */}
        <div className="bg-methodist-blue text-white rounded-xl p-8 text-center">
          <h3 className="font-heading text-2xl font-bold mb-4">Wednesday Evening Service</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join us midweek for intimate worship, prayer, and Bible study. A perfect way to reconnect and refocus during your busy week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center">
              <Clock className="mr-2" />
              <span>7:00 PM every Wednesday</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="mr-2" />
              <span>Prayer & Bible Study</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
