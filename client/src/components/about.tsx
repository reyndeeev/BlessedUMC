import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Handshake } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-4xl font-bold text-methodist-blue mb-6">
              Our Story & Mission
            </h2>
            <p className="text-lg text-warm-gray mb-6 leading-relaxed">
              For over 30 years, Blessed United Methodist Church has been a beacon of hope and love in our community. Since our founding in 1994, we’ve grown from a small group meeting in homes into a thriving church family that continues to serve and inspire.
            </p>
            <p className="text-lg text-warm-gray mb-8 leading-relaxed">
              Our mission is simple: to make disciples of Jesus Christ for the
              transformation of the world. We believe in open hearts, open
              minds, and open doors - welcoming all people to experience God's
              grace and love.
            </p>

            {/* Mission Values */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-methodist-blue rounded-full flex items-center justify-center">
                  <Heart className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">
                  Compassionate Care
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warm-gold rounded-full flex items-center justify-center">
                  <Handshake className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">
                  Community Service
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-soft-green rounded-full flex items-center justify-center">
                  <BookOpen className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">
                  Biblical Teaching
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-methodist-blue rounded-full flex items-center justify-center">
                  <Users className="text-white text-sm" />
                </div>
                <span className="font-medium text-methodist-blue">
                  Inclusive Fellowship
                </span>
              </div>
            </div>

            <Button
              className="bg-methodist-blue text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
              data-testid="button-learn-more"
            >
              Learn More About Us
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/480823083_122203830032219109_7273106123492049540_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeE5ke5wGYGnKRGjmNaFURjUYLo6q3-dY51gujqrf51jnd7C9oQIcGHdExMjGnEOBBcLgrtc5Nc2P75K2961dq6h&_nc_ohc=uTOq47RxpBEQ7kNvwGdgfZJ&_nc_oc=AdnRTTXswsFLzq7XgJNR3bD7ZXpodye66mfEz3N0qY5OrOCCTjq1XZj17ZPxszZbgJM&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=H0fW5bv0zx3NWNRLS1wO_w&oh=00_AfX7gzy4n0BHNa3m4SCZlE0FhC2AScCYm-KIko_3aPr0hg&oe=68ABA735"
              alt="Diverse congregation in worship"
              className="rounded-xl shadow-lg w-full h-64 object-cover"
              data-testid="image-congregation"
            />

            <img
              src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/480845914_122203824758219109_1965428847500889802_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHgwynWF_095mdGRZbJjZNH9AeeCakTB6r0B54JqRMHqk3eBWrp7PcQ794OV5igTD0twg0YMK-yCA5hxdhudns0&_nc_ohc=D_kqeKPNOtsQ7kNvwERMCU9&_nc_oc=AdmxWhabyqWjAzyyJk6dtgeevKtbVkoB5_L0GMSH8K52rY0CC6XKCAXrFDReKrZiL1Y&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=WYK-ATytekaBCsBQqjving&oh=00_AfWUcO7fUs5rIey57T0GH3QtGBK-aovH2dOr-BpE7m5OiA&oe=68AB99EE"
              alt="Prayer circle showing community"
              className="rounded-xl shadow-lg w-full h-48 object-cover mt-4"
              data-testid="image-prayer-circle"
            />

            <img
              src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/525108691_10162977892671768_663072904411918780_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cf85f3&_nc_eui2=AeHSJ4u9mvplFLz8CUOae3F9nZp9WrdsKUqdmn1at2wpSvjeOCYruBUKOT-geFjIzakc2aEcbUOW3_B28ZShP_gA&_nc_ohc=zFIlw1Ec8dsQ7kNvwF5GSOT&_nc_oc=AdkryzD5KxgingwdJ3GznTdzCe6-2OHK-uKKZdbk_h8N3YHGekHxpyvBCe_Ctn_hWMc&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=NgzftV7LUrrM-ffB4sSfSw&oh=00_AfV54pPjQ1didyrD6ST02ktgJhaR_e5mN1Jq_jHcRrNUrg&oe=68AB8B3E"
              alt="Church exterior architecture"
              className="rounded-xl shadow-lg w-full h-48 object-cover"
              data-testid="image-church-exterior"
            />

            <img
              src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/468934349_122189032268219109_3305669879632406230_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEmOY_YNYJKdmTMFKVgIAJhI9DQIcFU10kj0NAhwVTXSTq1jyvbK3UD-fh-by5fsI9rdakbl0PJPkOlFYNQx1Qr&_nc_ohc=546LyrMph7MQ7kNvwEQWS1S&_nc_oc=Adl_bDysVDvOcAkrCGDFRETjdOBVpL6BBmRxZN_PJWd4tV8ql-oANP7X4HH8ZUl0U9c&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=vE6LEco-GlJzA6taMjWfJg&oh=00_AfU6z2gonNq0UTUL3_JdHhEM78NOqHAe3oMEJUEosXJfnQ&oe=68AB9843"
              alt="Community service and outreach"
              className="rounded-xl shadow-lg w-full h-64 object-cover mt-4"
              data-testid="image-community-service"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
