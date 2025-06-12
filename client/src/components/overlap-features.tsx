import { Card, CardContent } from "@/components/ui/card";
import { Presentation, FileText, HelpCircle, MessageSquare } from "lucide-react";

export default function OverlapFeatures() {
  const features = [
    {
      icon: <Presentation className="h-8 w-8 text-[#F26B1D]" />,
      title: "Daily Video Classes",
      description: "Interactive live and recorded classes with expert instructors",
    },
    {
      icon: <FileText className="h-8 w-8 text-[#F26B1D]" />,
      title: "10,000+ Notes",
      description: "Comprehensive study materials prepared by experts",
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-[#F26B1D]" />,
      title: "Mock Tests & Quizzes",
      description: "Practice with real exam patterns and analysis",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-[#F26B1D]" />,
      title: "24x7 Doubt Support",
      description: "Get instant help from expert mentors anytime",
    },
  ];

  return (
    <div className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white shadow-lg rounded-xl border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-[#F26B1D]/10 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#333333]">{feature.title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}