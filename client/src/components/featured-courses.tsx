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
              {/* Top Banner */}
              <div className="relative bg-gradient-to-r from-[#F26B1D] to-[#D72638] h-32 flex items-center justify-center">
                {course.isOnline && (
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                    Online
                  </div>
                )}
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-1">🎓</div>
                  {course.isFree ? (
                    <div className="text-lg font-bold">FREE</div>
                  ) : (
                    <div>
                      <div className="text-sm opacity-90">₹{course.originalPrice}</div>
                      <div className="text-lg font-bold">₹{course.discountedPrice} for Complete Course</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6">
                {/* Title and Language */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full font-medium">
                      {course.language}
                    </span>
                    {course.discount && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full font-medium">
                        {course.discount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#666666] mb-3">
                    {course.tagline}
                  </p>
                  <p className="text-xs text-[#888888] mb-2">
                    by {course.instructor}
                  </p>
                </div>

                {/* Duration and Videos */}
                <div className="mb-4 space-y-2">
                  <p className="text-sm text-[#666666]">
                    📅 {course.duration}
                  </p>
                  <p className="text-sm text-[#666666]">
                    🎥 {course.videos}
                  </p>
                </div>

                {/* Pricing */}
                {!course.isFree && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      {course.originalPrice !== course.discountedPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{course.originalPrice}
                        </span>
                      )}
                      <span className="text-xl font-bold text-[#333333]">
                        ₹{course.discountedPrice}
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white transition-colors duration-200"
                  >
                    Explore
                  </Button>
                  <Button className="flex-1 bg-[#F26B1D] text-white hover:bg-[#D72638] transition-colors duration-200">
                    {course.isFree ? "Enroll Now" : "Buy Now"}
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