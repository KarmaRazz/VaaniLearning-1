import { useState } from "react";
import { useParams } from "wouter";
import { Star, Play, Download, Clock, Globe, Users } from "lucide-react";
import Navbar from "@/components/navbar";

interface Course {
  id: string;
  title: string;
  instructor: string;
  country: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  duration: string;
  language: string;
  heroImage: string;
  description: string;
  instructorBio: string;
  curriculum: Array<{
    chapter: string;
    lessons: Array<{
      title: string;
      duration: string;
      hasPreview: boolean;
    }>;
  }>;
  reviews: Array<{
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

// Dummy course data
const courseData: Course = {
  id: "1",
  title: "Complete Lok Sewa GK Course 2025 Full Preparation",
  instructor: "Dev Raj Mandal",
  country: "🇳🇵 Nepal",
  rating: 4.8,
  reviewCount: 30,
  price: 499,
  originalPrice: 999,
  duration: "8 weeks",
  language: "Nepali",
  heroImage: "/api/placeholder/600/400",
  description: "Master the complete General Knowledge syllabus for Lok Sewa Aayog examinations. This comprehensive course covers all important topics including Nepalese History, Geography, Constitution, Current Affairs, and more. Designed specifically for aspiring government employees with updated content for 2025 examinations.",
  instructorBio: "Dev Raj Mandal is a renowned educator with over 10 years of experience in preparing students for Lok Sewa examinations. He has helped thousands of students achieve their dream government jobs through his effective teaching methodology and comprehensive study materials.",
  curriculum: [
    {
      chapter: "Nepalese History & Culture",
      lessons: [
        { title: "Ancient Nepal History", duration: "45 min", hasPreview: true },
        { title: "Medieval Period", duration: "50 min", hasPreview: false },
        { title: "Modern Nepal", duration: "40 min", hasPreview: true },
        { title: "Cultural Heritage", duration: "35 min", hasPreview: false }
      ]
    },
    {
      chapter: "Geography of Nepal",
      lessons: [
        { title: "Physical Geography", duration: "60 min", hasPreview: true },
        { title: "Climate and Rivers", duration: "45 min", hasPreview: false },
        { title: "Natural Resources", duration: "50 min", hasPreview: false }
      ]
    },
    {
      chapter: "Constitution & Governance",
      lessons: [
        { title: "Constitution 2072", duration: "70 min", hasPreview: true },
        { title: "Federal Structure", duration: "55 min", hasPreview: false },
        { title: "Fundamental Rights", duration: "40 min", hasPreview: false }
      ]
    },
    {
      chapter: "Current Affairs 2025",
      lessons: [
        { title: "National Issues", duration: "30 min", hasPreview: true },
        { title: "International Affairs", duration: "35 min", hasPreview: false },
        { title: "Economic Updates", duration: "40 min", hasPreview: false }
      ]
    }
  ],
  reviews: [
    {
      name: "Rajesh Sharma",
      rating: 5,
      comment: "Excellent course content! Very well structured and comprehensive. Helped me clear my Lok Sewa exam on first attempt.",
      date: "2 weeks ago"
    },
    {
      name: "Sita Poudel",
      rating: 5,
      comment: "Dev sir's teaching method is outstanding. The course materials are updated and relevant for current examinations.",
      date: "1 month ago"
    },
    {
      name: "Anil Khadka",
      rating: 4,
      comment: "Great course for Lok Sewa preparation. Would definitely recommend to others preparing for government jobs.",
      date: "3 weeks ago"
    }
  ]
};

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState("curriculum");

  const tabs = [
    { id: "curriculum", label: "Curriculum" },
    { id: "description", label: "Description" },
    { id: "instructor", label: "Instructor" },
    { id: "reviews", label: "Reviews" }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "curriculum":
        return (
          <div className="space-y-6">
            {courseData.curriculum.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="font-semibold text-lg text-gray-800">{chapter.chapter}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {lesson.hasPreview ? (
                          <Play className="h-5 w-5 text-blue-600" />
                        ) : (
                          <div className="h-5 w-5" />
                        )}
                        <span className="text-gray-700">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                        {lesson.hasPreview && (
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Preview
                          </button>
                        )}
                        <Download className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {courseData.description}
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-[#F26B1D]" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-gray-600">{courseData.duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-[#F26B1D]" />
                <div>
                  <div className="font-semibold">Language</div>
                  <div className="text-gray-600">{courseData.language}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-[#F26B1D]" />
                <div>
                  <div className="font-semibold">Students</div>
                  <div className="text-gray-600">500+ enrolled</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "instructor":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F26B1D] to-[#D72638] flex items-center justify-center text-white text-2xl font-bold">
                {courseData.instructor.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{courseData.instructor}</h3>
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(courseData.rating)}
                  <span className="text-gray-600">({courseData.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {courseData.instructorBio}
                </p>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="space-y-6">
            {courseData.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{review.name}</h4>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Content */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {courseData.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-600">by <span className="font-semibold text-[#F26B1D]">{courseData.instructor}</span></span>
                <span className="text-lg">{courseData.country}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(courseData.rating)}
                </div>
                <span className="font-semibold text-gray-800">{courseData.rating}</span>
                <span className="text-gray-600">({courseData.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:pl-8">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <img
                  src={courseData.heroImage}
                  alt="Course Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Tabbed Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-[#F26B1D] text-[#F26B1D]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Sidebar - Course Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-8">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">Rs.{courseData.price}</span>
                  <span className="text-lg text-gray-500 line-through">Rs.{courseData.originalPrice}</span>
                </div>
                <div className="text-sm text-green-600 font-medium">50% off limited time</div>
              </div>

              {/* Course Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-semibold">{courseData.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{courseData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-semibold">{courseData.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(courseData.rating)}
                    <span className="text-sm text-gray-600">({courseData.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg">
                Enroll Now
              </button>

              {/* Additional Info */}
              <div className="mt-6 text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Downloadable resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}