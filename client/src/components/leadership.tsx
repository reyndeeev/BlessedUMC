import { Mail, Phone } from "lucide-react";

export default function Leadership() {
  const pastor = {
    name: "Rev. John B. Manalo",
    title: "Church Local Pastor CY (2025-2026)",
    description:
      "Rev. John B. Manalo faithfully serves as our Church Local Pastor, leading with dedication, humility, and a heart for God’s people.",
    image:
      "https://media.discordapp.net/attachments/948276718609772597/1407757423070150798/480479933_122203818086219109_7130687937921583998_n.jpg?ex=68a743c4&is=68a5f244&hm=58bfe1fa7091ecff624f97ed88d477e5f1eae04abf7325f044417582ec12f669&=&format=webp&width=648&height=648",
    email: "john.manalo@example.com", // replace with real email if available
    phone: "+63 900 000 0000",        // replace with real number if available
  };

  return (
    <section className="py-20 bg-methodist-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-white mb-4">
            Our Pastor
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Meet our dedicated pastor who guides our church family with wisdom,
            compassion, and faith.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow border border-white/20">
            <img
              src={pastor.image}
              alt={`${pastor.name} portrait`}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-white"
            />
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              {pastor.name}
            </h3>
            <p className="text-warm-gold font-medium mb-3">{pastor.title}</p>
            <p className="text-sm text-white mb-4 leading-relaxed">
              {pastor.description}
            </p>
            <div className="flex justify-center space-x-3">
              <a
                href={`mailto:${pastor.email}`}
                className="text-white hover:text-warm-gold transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={`tel:${pastor.phone}`}
                className="text-white hover:text-warm-gold transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
