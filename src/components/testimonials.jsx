export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer Intern",
      company: "TechCorp India",
      content:
        "CareerDwaar helped me land my dream internship. The process was smooth and user-friendly!",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Rahul Patel",
      role: "HR Manager",
      company: "InnovateNow Solutions",
      content:
        "As an employer, CareerDwaar made it easy to find talented interns. Highly recommended!",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <section className="py-20 bg-transparent">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Success Stories
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-transparent backdrop-blur-lg p-6 rounded-lg shadow-md border border-primary-orange"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border border-gray-300"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              &quot;{testimonial.content}&quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
