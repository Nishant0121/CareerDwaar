import Spline from "@splinetool/react-spline";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import QuickLinks from "../components/quicklinks";
import Testimonials from "../components/testimonials";

export default function Home() {
  return (
    <>
      {/* Background Spline Scene */}
      <div className="fixed z-0 top-0 left-0 w-full h-full ">
        <Spline scene="https://prod.spline.design/kRLfCZXoWS7UML7W/scene.splinecode" />
      </div>

      {/* Main content that scrolls over the Spline background */}
      <main className="relative z-10 flex flex-col min-h-screen bg-background/80 ">
        <Hero />
        <HowItWorks />
        <QuickLinks />
        <Testimonials />
      </main>
    </>
  );
}
