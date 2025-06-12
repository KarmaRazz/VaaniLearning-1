import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark leading-tight">
                Nepal's Trusted &{" "}
                <span className="text-primary-orange">Affordable</span>{" "}
                Learning Platform
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Prepare for Lok Sewa and CEE with notes, quizzes, and expert guidance. Join thousands of successful students.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-primary-orange to-primary-red hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-200"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-orange">15,000+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-orange">500+</div>
                <div className="text-sm text-gray-600">Video Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-orange">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Instructor Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-primary-orange/20 to-primary-red/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-gradient-to-br from-primary-red/20 to-primary-orange/20 rounded-full blur-3xl"></div>

              {/* Main instructor image placeholder */}
              <div className="relative z-10 w-80 h-80 rounded-full overflow-hidden shadow-2xl border-8 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-6xl text-gray-400">👨‍🏫</div>
              </div>

              {/* Floating achievement badges */}
              <div className="absolute top-12 -left-6 bg-white rounded-xl shadow-lg p-3 z-20">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">🏆</span>
                  <span className="text-sm font-semibold">Top Rated</span>
                </div>
              </div>

              <div className="absolute bottom-12 -right-6 bg-white rounded-xl shadow-lg p-3 z-20">
                <div className="flex items-center space-x-2">
                  <span className="text-primary-orange">👥</span>
                  <span className="text-sm font-semibold">15K+ Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
