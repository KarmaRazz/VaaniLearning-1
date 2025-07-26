import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Target, CheckCircle, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Study Materials",
      description: "Access 10,000+ study notes, formulas, and previous year questions tailored for competitive exams in Nepal."
    },
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Learn from experienced teachers who understand the Nepali education system and competitive exam patterns."
    },
    {
      icon: Target,
      title: "Goal-Specific Preparation",
      description: "Customized content for CEE, IOE, Lok Sewa, ACCA, and other competitive examinations."
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "Thousands of successful students have achieved their dreams through our platform."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Study Notes" },
    { number: "50,000+", label: "Students" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ];

  const achievements = [
    "Nepal's most trusted online learning platform",
    "Affordable education for all economic backgrounds",
    "Specialized content for Nepali competitive exams",
    "Interactive learning with video lectures",
    "Mock tests and practice questions",
    "Personalized study plans and progress tracking"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F26B1D] to-[#D72638] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About Vaani
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Nepal's trusted and affordable learning platform empowering students to excel in competitive examinations
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-white text-[#F26B1D] hover:bg-gray-100 font-semibold"
                >
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Vaani is dedicated to democratizing quality education in Nepal. We believe that every aspiring student, 
                regardless of their economic background or geographical location, deserves access to world-class 
                educational resources for competitive exam preparation.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our platform specifically addresses the unique challenges faced by Nepali students preparing for 
                competitive examinations like CEE (Medical), IOE (Engineering), Lok Sewa Aayog, and professional 
                certifications like ACCA.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm border">
                    <div className="text-2xl sm:text-3xl font-bold text-[#F26B1D] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    What Makes Vaani Special
                  </h3>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Vaani?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We understand the challenges of competitive exam preparation in Nepal and have built our platform to address them effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Our Vision for Nepal's Education
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We envision a Nepal where every student has equal access to quality education and competitive exam preparation, 
                regardless of their location or economic status. Through technology and innovation, we're bridging the 
                educational gap between urban and rural areas.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#F26B1D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Accessibility</h3>
                  <p className="text-gray-600 text-sm">Making quality education accessible to students from all backgrounds</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#F26B1D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Excellence</h3>
                  <p className="text-gray-600 text-sm">Maintaining the highest standards in educational content and delivery</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#F26B1D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600 text-sm">Building a supportive community of learners and educators</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-[#F26B1D] to-[#D72638] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their dreams with Vaani. 
            Your success story starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white text-[#F26B1D] hover:bg-gray-100 font-semibold"
              >
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#F26B1D] font-semibold"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}