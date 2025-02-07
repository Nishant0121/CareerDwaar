import { Building, FileSearch, UserCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "For Students",
      description:
        "Create a profile, browse opportunities, and apply with ease.",
      icon: <UserCircle className="h-10 w-10 text-primary" />,
    },
    {
      title: "For Employers",
      description:
        "Post jobs, review applications, and find the perfect candidates.",
      icon: <Building className="h-10 w-10 text-primary" />,
    },
    {
      title: "Application Process",
      description:
        "Apply with a single click and track your application status.",
      icon: <FileSearch className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <section className="py-24 bg-muted/50">
      <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative p-6 rounded-lg bg-transparent backdrop-blur-md border border-primary-blue hover:bg-card/80 transition-colors"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary-orange/10">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
