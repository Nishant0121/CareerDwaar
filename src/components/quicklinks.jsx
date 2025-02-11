import { PlusCircle, Search } from "lucide-react";
import "react";
import { Link } from "react-router-dom";

export default function QuickLinks() {
  return (
    <section className="py-24 bg-background">
      <h2 className="text-4xl font-bold text-center mb-16">Quick Links</h2>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link
          to={"/job"}
          className="inline-flex items-center bg-transparent hover:bg-primary-orange hover:border-white backdrop-blur-lg border border-primary-orange text-secondary-foreground  px-8 py-4 rounded-4xl  text-lg font-medium transition-colors"
        >
          <Search className="mr-2 h-5 w-5" />
          View Jobs
        </Link>
        <Link
          to={"/add-job"}
          className="inline-flex items-center bg-primary-orange text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-4xl  text-lg font-medium transition-colors"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Post a Job
        </Link>
      </div>
    </section>
  );
}
