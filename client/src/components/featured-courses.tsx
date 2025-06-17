import { Button } from "@/components/ui/button";

export default function FeaturedCourses() {
  const courses = [
    {
      title: "Pre-Medical Entrance 2025",
      tagline: "For Class 12 & Dropper Students",
      instructor: "Sujata Sah",
      duration: "Starts on 5 July 2025 – Ends on 30 Sept 2025",
      language: "Nepali",
      originalPrice: 1499,
      discountedPrice: 1299,
      discount: "13% off applied",
      videos: "45 Days | 60+ Videos",
      isOnline: true,
      imageUrl: "/attached_assets/ChatGPT Image Jun 17, 2025, 10_23_38 AM_1750135214080.png",
    },
    {
      title: "Engineering (IOE) Full Prep",
      tagline: "Complete IOE entrance preparation",
      instructor: "David Kumar",
      duration: "Starts on 1 Aug 2025 – Ends on 15 Nov 2025",
      language: "Hinglish",
      originalPrice: 1999,
      discountedPrice: 1999,
      discount: null,
      videos: "75 Days | 90+ Videos",
      isOnline: true,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=center",
    },
    {
      title: "Lok Sewa (Kharidar/Subba)",
      tagline: "Government job preparation course",
      instructor: "Anita Sharma",
      duration: "Starts on 1 July 2025 – Ongoing",
      language: "Nepali",
      originalPrice: 0,
      discountedPrice: 0,
      discount: null,
      videos: "60 Days | 100+ Videos",
      isOnline: true,
      isFree: true,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
    },
  ];

  return (
    <section className="py-16 bg-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300 border border-gray-100"
            >
              {/* Course Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                {course.isOnline && (
                  <div className="absolute top-3 left-3 bg-[#F26B1D] text-white px-3 py-1 text-xs font-medium rounded z-10">
                    ONLINE
                  </div>
                )}
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Price Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white text-center">
                    {course.isFree ? (
                      <div className="text-xl font-bold">FREE</div>
                    ) : (
                      <div>
                        <span className="line-through text-sm opacity-80">₹{course.originalPrice}</span>
                        <span className="text-xl font-bold ml-2">₹{course.discountedPrice}</span>
                        <div className="text-xs">FOR COMPLETE COURSE</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-4">
                {/* Title Row with Badges */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-[#333333]">{course.title}</h4>
                  <div className="flex gap-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded font-medium">
                      NEW
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                      {course.language}
                    </span>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="flex items-center gap-2 mb-3 text-sm text-[#666666]">
                  <span>🎯</span>
                  <span>{course.tagline}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 mb-4 text-sm text-[#666666]">
                  <span>📅</span>
                  <span>{course.duration}</span>
                </div>

                {/* Plans */}
                <div className="mb-4">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium inline-block">
                    More plans inside
                  </div>
                </div>

                {/* Final Price and Discount */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-[#F26B1D]">₹{course.discountedPrice}</span>
                    {!course.isFree && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{course.originalPrice}</span>
                    )}
                    <div className="text-xs text-gray-500">(FOR FULL BATCH)</div>
                  </div>
                  {course.discount && (
                    <div className="text-xs text-green-600 font-medium">
                      ✅ {course.discount}
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white transition-colors duration-200 font-semibold"
                  >
                    EXPLORE
                  </Button>
                  <Button className="flex-1 bg-[#F26B1D] text-white hover:bg-[#D72638] transition-colors duration-200 font-semibold">
                    {course.isFree ? "ENROLL NOW" : "BUY NOW"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Courses Link */}
        <div className="text-center mt-12">
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