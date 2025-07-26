import Navbar from "@/components/navbar";
import { CourseCard } from "@/components/CourseCard";

const otherCourses = [
  { title: "Computer Operator Preparation" },
  { title: "Banking & Finance Courses" },
  { title: "Teaching License Preparation" },
  { title: "Language Learning Programs" },
  { title: "Skill Development Courses" },
  { title: "Professional Certification Programs" },
];

export default function OthersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Others
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore diverse learning opportunities beyond traditional exams. From professional certifications to skill development programs, discover courses that enhance your career prospects and personal growth.
            </p>
          </div>

          {/* Course Cards Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCourses.map((course, index) => (
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
              Beyond Traditional Learning
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-6">
                In today's rapidly evolving job market, continuous learning and skill development are essential for career advancement. Our "Others" category encompasses a wide range of professional development courses, certification programs, and specialized training designed to meet diverse learning needs.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Professional Development Areas
              </h3>
              <p className="mb-6">
                We offer courses spanning multiple domains including information technology, business management, language skills, teaching methodologies, and industry-specific certifications. Each program is designed to provide practical knowledge and skills that directly translate to workplace success.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Course Categories
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Computer Operator and Data Entry preparation programs</li>
                <li>Banking and Financial Services training courses</li>
                <li>Teaching License and Education sector preparation</li>
                <li>English and foreign language proficiency programs</li>
                <li>Digital marketing and social media management</li>
                <li>Entrepreneurship and business development skills</li>
                <li>Technical and vocational training programs</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Learning Approach
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Practical, hands-on learning with real-world applications</li>
                <li>Industry-relevant curriculum updated with current trends</li>
                <li>Expert instructors with professional experience</li>
                <li>Flexible scheduling to accommodate working professionals</li>
                <li>Certificate programs recognized by relevant authorities</li>
                <li>Career counseling and job placement assistance</li>
              </ul>

              <p>
                Whether you're looking to switch careers, upgrade your skills, or pursue a new passion, our diverse course offerings provide the foundation for lifelong learning and professional growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}