import Navbar from "@/components/navbar";
import { CourseCard } from "@/components/CourseCard";

const iomCourses = [
  { title: "IOM Engineering Entrance - Mathematics" },
  { title: "IOM Engineering Entrance - Physics" },
  { title: "IOM Engineering Entrance - Chemistry" },
  { title: "Complete Mock Test Series" },
  { title: "Previous Year Question Bank" },
  { title: "Formula Sheets & Quick Revision" },
];

export default function IOMPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              IOM
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Institute of Medicine (IOM) entrance preparation for engineering and technical programs. Master Mathematics, Physics, and Chemistry with our structured learning approach designed for IOM aspirants.
            </p>
          </div>

          {/* Course Cards Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {iomCourses.map((course, index) => (
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
              About IOM Entrance Preparation
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-6">
                The Institute of Medicine (IOM) conducts entrance examinations for various engineering and technical programs. Our comprehensive preparation program covers all essential subjects with a focus on problem-solving techniques and conceptual understanding.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Exam Structure & Syllabus
              </h3>
              <p className="mb-6">
                The IOM entrance exam typically includes Mathematics, Physics, and Chemistry based on the +2 level curriculum. The exam format consists of multiple-choice questions with a time limit of 3 hours. Strong foundation in these core subjects is essential for success.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Preparation Strategy
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Subject-wise comprehensive study materials and video lectures</li>
                <li>Regular practice sessions with IOM-pattern questions</li>
                <li>Weekly mock tests to track progress and improve time management</li>
                <li>Detailed analysis of previous year papers and trends</li>
                <li>Expert guidance from experienced faculty members</li>
                <li>Doubt resolution sessions and one-on-one mentoring</li>
              </ul>

              <p>
                Join our proven IOM preparation program and increase your chances of securing admission to your desired engineering or technical program at the Institute of Medicine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}