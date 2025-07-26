import Navbar from "@/components/navbar";
import { CourseCard } from "@/components/CourseCard";

const accaCourses = [
  { title: "ACCA F1 - Accountant in Business" },
  { title: "ACCA F2 - Management Accounting" },
  { title: "ACCA F3 - Financial Accounting" },
  { title: "ACCA Strategic Professional Level" },
  { title: "ACCA Mock Exams & Practice" },
  { title: "ACCA Ethics & Professional Skills" },
];

export default function ACCAPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              ACCA
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Association of Chartered Certified Accountants (ACCA) preparation program. Build your global accounting career with our comprehensive ACCA courses covering all levels from Applied Knowledge to Strategic Professional.
            </p>
          </div>

          {/* Course Cards Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accaCourses.map((course, index) => (
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
              About ACCA Qualification
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-6">
                The Association of Chartered Certified Accountants (ACCA) is a globally recognized professional accounting qualification. Our comprehensive preparation program helps you master all aspects of accounting, finance, and business management required for a successful career in accountancy.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                ACCA Qualification Structure
              </h3>
              <p className="mb-6">
                The ACCA qualification consists of three levels: Applied Knowledge (3 papers), Applied Skills (6 papers), and Strategic Professional (4 papers including 2 Essential and 2 Options). Each level builds upon the previous one, providing comprehensive business and accounting knowledge.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Career Opportunities
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Financial Controller and Chief Financial Officer roles</li>
                <li>Management Consultant and Business Analyst positions</li>
                <li>Audit Manager and External Auditor opportunities</li>
                <li>Tax Advisor and Financial Advisor roles</li>
                <li>Investment Banking and Corporate Finance careers</li>
                <li>Entrepreneurship and business ownership</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Our ACCA Preparation Advantage
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Expert instructors with ACCA qualification and industry experience</li>
                <li>Comprehensive study materials aligned with ACCA syllabus</li>
                <li>Regular practice sessions with exam-style questions</li>
                <li>Mock exams that simulate actual ACCA examination conditions</li>
                <li>Flexible learning options with online and offline classes</li>
                <li>Career guidance and placement assistance for qualified students</li>
              </ul>

              <p>
                Transform your career prospects with ACCA qualification through our proven teaching methodology and comprehensive support system designed for success in the global accounting profession.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}