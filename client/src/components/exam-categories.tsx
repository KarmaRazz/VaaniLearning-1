import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function ExamCategories() {
  // Fetch goals from database
  const { data: goalsData, isLoading } = useQuery({
    queryKey: ["/api/goals"],
    queryFn: async () => {
      const response = await fetch("/api/goals");
      if (!response.ok) throw new Error("Failed to fetch goals");
      return response.json();
    },
  });

  // Sort goals with CEE first, then alphabetical
  const goals = goalsData ? [...goalsData].sort((a, b) => {
    if (a.name === "CEE") return -1;
    if (b.name === "CEE") return 1;
    return a.name.localeCompare(b.name);
  }) : [];

  const formatGoalUrl = (goalName: string) => {
    return `/explore/${goalName.toLowerCase().replace(/\s+/g, "")}`;
  };

  // Mapping goals to display data with icons and colors
  const getGoalDisplayData = (goalName: string) => {
    const goalData: Record<string, any> = {
      "CEE": {
        tags: ["Pre-Medical", "Dropper"],
        icon: "🧬",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100",
      },
      "IOE": {
        tags: ["Class 11", "Class 12", "Dropper"],
        icon: "🧮",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
      },
      "Lok Sewa": {
        tags: ["Kharidar/Subba", "Computer Operator", "Officer Level"],
        icon: "🏛️",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100",
      },
      "Language": {
        tags: ["Korean", "Japanese"],
        icon: "🈶",
        bgColor: "bg-yellow-50",
        iconBg: "bg-yellow-100",
      },
      "Board": {
        tags: ["Class 10", "Class 12"],
        icon: "🏫",
        bgColor: "bg-pink-50",
        iconBg: "bg-pink-100",
      },
      "License": {
        tags: ["Engineering", "Medical"],
        icon: "🎓",
        bgColor: "bg-indigo-50",
        iconBg: "bg-indigo-100",
      },
      "ACCA": {
        tags: ["Professional", "Finance", "Accounting"],
        icon: "💼",
        bgColor: "bg-teal-50",
        iconBg: "bg-teal-100",
      },
      "Others": {
        tags: ["Various", "Skill Development"],
        icon: "📚",
        bgColor: "bg-gray-50",
        iconBg: "bg-gray-100",
      }
    };
    
    return goalData[goalName] || {
      tags: ["Preparation", "Study"],
      icon: "📖",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-100",
    };
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Choose Your <span className="text-[#F26B1D]">Goals</span>
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Find comprehensive preparation materials for your target exam
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }



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
          {goals?.map((goal: any) => {
            const displayData = getGoalDisplayData(goal.name);
            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100"
              >
                {/* Header with title and icon */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                      {goal.name}
                    </h3>
                  </div>
                  <div className={`w-12 h-12 ${displayData.iconBg} rounded-full flex items-center justify-center text-xl`}>
                    {displayData.icon}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {displayData.tags.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-[#666666] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href={formatGoalUrl(goal.name)}>
                  <button className="text-[#D72638] font-medium hover:underline flex items-center gap-1 transition-colors duration-200">
                    Explore Goal
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Goals */}
        <div className="text-center">
          <button className="text-[#6C63FF] font-semibold text-lg hover:underline transition-colors duration-200">
            View All Goals ({goals?.length || 0})
          </button>
        </div>
      </div>
    </section>
  );
}