import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, PlayCircle, Users } from "lucide-react";

export default function FeaturedCourses() {
  const courses = [
    {
      title: "Pre-Medical",
      tagline: "Designed for Class 12 & Dropper Students",
      duration: "30 Days",
      videos: "50+ Videos",
      instructor: "by Sujata Sah",
      price: "Rs. 1499",
      isFree: false,
    },
    {
      title: "Engineering Entrance (IOE)",
      tagline: "Complete preparation for IOE entrance",
      duration: "45 Days",
      videos: "75+ Videos",
      instructor: "by Ramesh Karki",
      price: "Rs. 1999",
      isFree: false,
    },
    {
      title: "Lok Sewa (Kharidar/Subba)",
      tagline: "Government job preparation course",
      duration: "60 Days",
      videos: "100+ Videos",
      instructor: "by Anita Sharma",
      price: "Free",
      isFree: true,
    },
    {
      title: "CMAT Crash Course",
      tagline: "MBA entrance preparation",
      duration: "20 Days",
      videos: "35+ Videos",
      instructor: "by Prakash Thapa",
      price: "Rs. 999",
      isFree: false,
    },
    {
      title: "Korean Language",
      tagline: "Learn Korean from basics to advanced",
      duration: "40 Days",
      videos: "60+ Videos",
      instructor: "by Min Jung Lee",
      price: "Rs. 1199",
      isFree: false,
    },
    {
      title: "Medical License Preparation",
      tagline: "For medical professionals",
      duration: "25 Days",
      videos: "40+ Videos",
      instructor: "by Dr. Sapana Kc",
      price: "Rs. 999",
      isFree: false,
    },
    {
      title: "Computer Operator - Lok Sewa",
      tagline: "Government computer operator preparation",
      duration: "30 Days",
      videos: "45+ Videos",
      instructor: "by Biraj Adhikari",
      price: "Free",
      isFree: true,
    },
  ];

  return (
    <section className="py-16 bg-[#FDF7F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Featured <span className="text-[#F26B1D]">Courses</span>
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Top competitive exam courses we offer
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 mb-6"
            >
              <CardContent className="p-6">
                {/* Course Title and Tagline */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {course.tagline}
                  </p>
                </div>

                {/* Course Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-[#666666]">
                    <Clock className="h-4 w-4 mr-2 text-[#F26B1D]" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-[#666666]">
                    <PlayCircle className="h-4 w-4 mr-2 text-[#F26B1D]" />
                    {course.videos}
                  </div>
                  <div className="flex items-center text-sm text-[#666666]">
                    <Users className="h-4 w-4 mr-2 text-[#F26B1D]" />
                    {course.instructor}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-[#333333]">
                    {course.isFree ? (
                      <span className="text-green-600">{course.price}</span>
                    ) : (
                      <span>{course.price}</span>
                    )}
                  </div>
                  <Button className="bg-[#F26B1D] text-white hover:bg-[#D72638] rounded px-4 py-2 text-sm font-semibold transition-colors duration-200">
                    {course.isFree ? "Enroll Now" : "View Course"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Courses Link */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="border-2 border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}