import Navbar from "@/components/navbar";
import { CourseCard } from "@/components/CourseCard";

const lokSewaCourses = [
  { title: "Lok Sewa General Knowledge" },
  { title: "Nepali Language & Literature" },
  { title: "English Language Skills" },
  { title: "Current Affairs & GK" },
  { title: "Constitution of Nepal" },
  { title: "Previous Year Question Bank" },
];

export default function LokSewaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Lok Sewa
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Prepare for Lok Sewa Aayog examinations with our comprehensive study materials. Master General Knowledge, Nepali, English, and current affairs to secure your government job in Nepal.
            </p>
          </div>

          {/* Course Cards Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lokSewaCourses.map((course, index) => (
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
              About Lok Sewa Aayog Preparation
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-6">
                Lok Sewa Aayog (Public Service Commission) is Nepal's constitutional body responsible for recruiting civil servants. Our preparation program covers all essential subjects and topics required for various levels of government job examinations conducted by Lok Sewa Aayog.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Exam Levels & Categories
              </h3>
              <p className="mb-6">
                Lok Sewa Aayog conducts examinations for various levels including Adhikrit (Officer Level), Sahayak (Assistant Level), Kharidar (Non-Gazetted First Class), and Sahayak Kharidar (Non-Gazetted Second Class) positions across different ministries and departments.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Subject Areas
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>General Knowledge and Current Affairs (National & International)</li>
                <li>Nepali Language, Literature, and Grammar</li>
                <li>English Language Proficiency and Communication Skills</li>
                <li>Constitution of Nepal and Legal Knowledge</li>
                <li>Geography, History, and Culture of Nepal</li>
                <li>Basic Mathematics and Logical Reasoning</li>
                <li>Computer Literacy and Information Technology</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Why Choose Our Lok Sewa Preparation?
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Updated study materials aligned with latest exam patterns</li>
                <li>Regular mock tests and practice sessions</li>
                <li>Current affairs updates and GK enhancement programs</li>
                <li>Expert faculty with years of Lok Sewa coaching experience</li>
                <li>Interview preparation and personality development sessions</li>
                <li>Success stories from hundreds of placed candidates</li>
              </ul>

              <p>
                Start your journey towards a secure government career with our proven Lok Sewa preparation methodology and comprehensive study resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}