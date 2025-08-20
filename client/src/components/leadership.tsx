import { Mail, Phone } from "lucide-react";

export default function Leadership() {
  const leaders = [
    {
      name: "Rev. Sarah Johnson",
      title: "Senior Pastor",
      description: "Rev. Johnson brings 15 years of pastoral experience and a heart for community outreach. She holds an M.Div from Duke Divinity School.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Rev. Michael Chen",
      title: "Associate Pastor",
      description: "Rev. Chen specializes in youth ministry and family counseling. He's passionate about building bridges between generations in our church family.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Dr. Emily Rodriguez",
      title: "Director of Music Ministries",
      description: "Dr. Rodriguez leads our choir, contemporary band, and children's music programs. She has a Doctor of Musical Arts in Church Music.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-methodist-blue mb-4">Our Leadership Team</h2>
          <p className="text-xl text-warm-gray max-w-3xl mx-auto">
            Meet the dedicated servants who guide our church family with wisdom, compassion, and faith.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
              <img 
                src={leader.image}
                alt={`${leader.name} portrait`}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                data-testid={`image-leader-${index}`}
              />
              <h3 className="font-heading text-xl font-bold text-methodist-blue mb-2">{leader.name}</h3>
              <p className="text-warm-gold font-medium mb-3">{leader.title}</p>
              <p className="text-sm text-warm-gray mb-4 leading-relaxed">
                {leader.description}
              </p>
              <div className="flex justify-center space-x-3">
                <button 
                  className="text-methodist-blue hover:text-warm-gold transition-colors"
                  data-testid={`button-email-leader-${index}`}
                >
                  <Mail className="h-5 w-5" />
                </button>
                <button 
                  className="text-methodist-blue hover:text-warm-gold transition-colors"
                  data-testid={`button-phone-leader-${index}`}
                >
                  <Phone className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
