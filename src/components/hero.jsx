import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="text-center py-32 bg-gradient-to-b from-background to-muted">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from- to-primary/60 bg-clip-text text-primary-orange">
        Welcome to CareerDwaar
      </h1>
      <p className="text-xl mb-10 text-i max-w-2xl mx-auto">
        Your gateway to exciting internships and job opportunities
      </p>
      <Link
        to={"/job"}
        className="inline-flex items-center bg-primary-orange text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg font-medium transition-colors"
      >
        Find Internships/Jobs
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </section>
  );
}
