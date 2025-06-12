import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#F26B1D] to-[#D72638] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Learn from Nepal's{" "}
                <span className="block">Best Platform</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                Unlock your potential by signing up with Vaani – The most affordable learning solution
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center md:justify-start">
              <Button className="bg-[#D72638] hover:bg-[#F26B1D] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right Content - Instructor Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative z-10 w-[80%] max-w-md mx-auto md:ml-auto md:mr-8">
              {/* Dotted circular background */}
              <div className="absolute inset-0 w-80 h-80 rounded-full border-4 border-dotted border-white/30 animate-pulse"></div>
              <div className="absolute inset-4 w-72 h-72 rounded-full border-2 border-dotted border-white/20"></div>
              
              {/* Main instructor image placeholder with floating badges */}
              <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl border-8 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center z-10">
                <div className="text-8xl text-gray-400">👨‍🏫</div>
                
                {/* Floating achievement badges - positioned within circle bounds */}
                <div className="absolute top-[-20px] left-4 bg-white p-2 px-4 rounded-xl shadow-md text-sm z-20 animate-bounce">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500 text-lg">🏆</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Top Rated</div>
                      <div className="text-xs text-gray-600">Platform</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-[-10px] bg-white p-2 px-4 rounded-xl shadow-md text-sm z-20 animate-bounce" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500 text-lg">📚</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">10K+</div>
                      <div className="text-xs text-gray-600">Notes</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 right-4 bg-white p-2 px-4 rounded-xl shadow-md text-sm z-20 animate-bounce" style={{ animationDelay: "2s" }}>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#F26B1D] text-lg">👥</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">5K+</div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
