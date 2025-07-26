import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, Target } from "lucide-react";

export default function MockTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 sm:p-12">
              {/* Animated Icon */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center animate-pulse">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#F26B1D] to-[#D72638] rounded-full opacity-30 animate-ping"></div>
                </div>
              </div>

              {/* Main Message */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                🚧 Mock Tests Coming Soon!
              </h1>
              
              {/* Subtext */}
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We're working hard to bring you full-length mock tests tailored for your goals. Stay tuned!
              </p>

              {/* Feature Preview */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#F26B1D]/10 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-[#F26B1D]" />
                  </div>
                  <span className="text-gray-700 text-sm">Timed practice tests</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#F26B1D]/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-[#F26B1D]" />
                  </div>
                  <span className="text-gray-700 text-sm">Goal-specific question banks</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#F26B1D]/10 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-[#F26B1D]" />
                  </div>
                  <span className="text-gray-700 text-sm">Detailed performance analytics</span>
                </div>
              </div>

              {/* Coming Soon Badge */}
              <div className="mt-8 inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#F26B1D] to-[#D72638] text-white text-sm font-medium rounded-full">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                In Development
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
