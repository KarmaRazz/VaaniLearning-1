import { ArrowRight } from "lucide-react";

export default function ExamCategories() {
  const categories = [
    {
      title: "CEE",
      tags: ["Pre-Medical", "Dropper"],
      icon: "🧬",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      title: "IOE",
      tags: ["Class 11", "Class 12", "Dropper"],
      icon: "🧮",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "Lok Sewa",
      tags: ["Kharidar/Subba", "Computer Operator", "Officer Level"],
      icon: "🏛️",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
    {
      title: "Language",
      tags: ["Korean", "Japanese"],
      icon: "🈶",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Board",
      tags: ["Class 10", "Class 12"],
      icon: "🏫",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
    },
    {
      title: "License",
      tags: ["Engineering", "Medical"],
      icon: "🎓",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Choose Your <span className="text-[#F26B1D]">Goals</span>
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Find comprehensive preparation materials for your target exam
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100"
            >
              {/* Header with title and icon */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    {category.title}
                  </h3>
                </div>
                <div className={`w-12 h-12 ${category.iconBg} rounded-full flex items-center justify-center text-xl`}>
                  {category.icon}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {category.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-[#666666] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <button className="text-[#D72638] font-medium hover:underline flex items-center gap-1 transition-colors duration-200">
                Explore Goal
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* View All Goals */}
        <div className="text-center">
          <button className="text-[#6C63FF] font-semibold text-lg hover:underline transition-colors duration-200">
            View All Goals ({categories.length})
          </button>
        </div>
      </div>
    </section>
  );
}