import { Card, CardContent } from "@/components/ui/card";
import { Presentation, FileText, HelpCircle, MessageSquare, Shield, Download, TrendingUp } from "lucide-react";

export default function FeatureCards() {
  const mainFeatures = [
    {
      icon: <Presentation className="h-8 w-8" />,
      title: "Daily Video Classes",
      description: "Interactive live and recorded classes with expert instructors covering all topics systematically.",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "10,000+ Notes",
      description: "Comprehensive study materials and notes prepared by subject matter experts and toppers.",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
    },
    {
      icon: <HelpCircle className="h-8 w-8" />,
      title: "Mock Tests & Quizzes",
      description: "Practice with real exam patterns and get detailed performance analysis and feedback.",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "24x7 Doubt Support",
      description: "Get instant help from our expert mentors anytime, anywhere through chat and video calls.",
      bgColor: "from-orange-50 to-red-100",
      borderColor: "border-orange-200",
      iconBg: "bg-gradient-to-r from-primary-orange to-primary-red",
    },
  ];

  const additionalFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-yellow-600" />,
      title: "Money Back Guarantee",
      description: "100% refund if not satisfied within 7 days",
      bgColor: "bg-yellow-100",
    },
    {
      icon: <Download className="h-8 w-8 text-indigo-600" />,
      title: "Offline Access",
      description: "Download content and study without internet",
      bgColor: "bg-indigo-100",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-pink-600" />,
      title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics",
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <section className="py-16 mt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Why Choose <span className="text-primary-orange">Vaani</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed in your Lok Sewa and CEE preparation journey
          </p>
        </div>

        {/* Main Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${feature.bgColor} ${feature.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-full flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-dark">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 ${feature.bgColor} rounded-full mb-4`}>
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold text-dark mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
