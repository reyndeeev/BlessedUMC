import Header from "@/components/header";
import Hero from "@/components/hero";
import QuickInfo from "@/components/quick-info";
import About from "@/components/about";
import Worship from "@/components/worship";
import Leadership from "@/components/leadership";
import Ministries from "@/components/ministries";
import Events from "@/components/events";
import SermonCatchup from "@/components/sermon-catchup";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="font-sans bg-gray-50">
      <Header />
      <Hero />
      <QuickInfo />
      <About />
      <Worship />
      <Leadership />
      <Ministries />
      <Events />
      <SermonCatchup />
      <Contact />
      <Footer />
    </div>
  );
}
