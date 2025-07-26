import Navbar from "@/components/navbar";
import { CourseCard } from "@/components/CourseCard";

const ceeCourses = [
  { title: "CEE Crash Course - Physics" },
  { title: "CEE Crash Course - Chemistry" },
  { title: "CEE Crash Course - Biology" },
  { title: "One Shot Series - Mathematics" },
  { title: "Previous Year Solutions" },
  { title: "Mock Test Series" },
];

export default function CEEPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              CEE
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CEE is Nepal's most competitive entrance exam for medical students. Our comprehensive courses and study materials are designed to help you excel in Physics, Chemistry, Biology, and Mathematics.
            </p>
          </div>

          {/* Course Cards Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ceeCourses.map((course, index) => (
                <CourseCard 
                  key={index}
                  title={course.title}
                  isComingSoon={true}
                />
              ))}
            </div>
          </div>

          {/* Detailed Description Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              About CEE Preparation
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-6">
                The Common Entrance Examination (CEE) is conducted by the Institute of Medicine (IOM) for admission to various medical programs including MBBS, BDS, B.Sc. Nursing, and other health science programs in Nepal. This highly competitive exam requires thorough preparation across four core subjects.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Exam Pattern & Subjects
              </h3>
              <p className="mb-6">
                The CEE exam consists of 200 multiple-choice questions covering Physics (50 questions), Chemistry (50 questions), Biology (Botany 25 + Zoology 25 questions), and Mathematics (50 questions). Each correct answer carries 1 mark, with no negative marking.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Why Choose Vaani for CEE Preparation?
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Comprehensive coverage of all four subjects with expert faculty</li>
                <li>Regular mock tests that simulate the actual exam environment</li>
                <li>Previous year question papers with detailed solutions</li>
                <li>Subject-wise crash courses for quick revision</li>
                <li>24/7 doubt clearing support from qualified teachers</li>
                <li>Affordable pricing with flexible payment options</li>
              </ul>

              <p>
                Join thousands of successful CEE aspirants who have achieved their medical dreams through Vaani's proven teaching methodology and comprehensive study materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}