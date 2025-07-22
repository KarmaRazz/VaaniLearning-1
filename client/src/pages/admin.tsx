import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  GraduationCap, 
  Globe, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isWebsiteCMSOpen, setIsWebsiteCMSOpen] = useState(false);
  const { logout } = useAdminAuth();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'instructors', label: 'Instructors', icon: GraduationCap },
    { 
      id: 'website-cms', 
      label: 'Website CMS', 
      icon: Globe,
      isDropdown: true,
      subItems: [
        { id: 'hero-section', label: 'Hero Section' },
        { id: 'stats-section', label: 'Stats Section' },
        { id: 'course-categories', label: 'Course Categories' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'footer-socials', label: 'Footer & Socials' }
      ]
    },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'website-cms') {
      setIsWebsiteCMSOpen(!isWebsiteCMSOpen);
    } else if (sectionId === 'logout') {
      logout();
    } else {
      setActiveSection(sectionId);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'courses':
        return <CoursesContent />;
      case 'notes':
        return <NotesContent />;
      case 'users':
        return <UsersContent />;
      case 'instructors':
        return <InstructorsContent />;
      case 'hero-section':
        return <HeroSectionContent />;
      case 'stats-section':
        return <StatsSectionContent />;
      case 'course-categories':
        return <CourseCategoriesContent />;
      case 'testimonials':
        return <TestimonialsContent />;
      case 'footer-socials':
        return <FooterSocialsContent />;
      case 'reports':
        return <ReportsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <PlaceholderContent section={activeSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#F8F9FA] shadow-lg flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#F26B1D]">Vaani Admin</h1>
          <p className="text-sm text-gray-600">Management Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleSectionClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#F26B1D] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.isDropdown && (
                  <div className="ml-auto">
                    {isWebsiteCMSOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                )}
              </button>

              {/* Dropdown Items */}
              {item.isDropdown && isWebsiteCMSOpen && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subItems?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveSection(subItem.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === subItem.id
                          ? 'bg-[#D72638] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              <p className="text-sm text-gray-600">
                Manage your {activeSection.replace('-', ' ')} settings
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 bg-red-400 rounded-full"></span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Welcome, Admin</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
                <div className="h-10 w-10 bg-[#F26B1D] rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Placeholder Content Components
const PlaceholderContent = ({ section }: { section: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Settings className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
        {section.replace('-', ' ')} Section
      </h3>
      <p className="text-gray-600">
        Select a section to begin managing your Vaani platform
      </p>
    </div>
  </div>
);

const DashboardContent = () => {
  const statsCards = [
    {
      title: "Total Courses",
      value: "34",
      icon: "📚",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      valueColor: "text-blue-800"
    },
    {
      title: "Total Revenue",
      value: "Rs. 142,000",
      icon: "💰",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      textColor: "text-green-700",
      valueColor: "text-green-800",
      hasDropdown: true,
      dropdownOptions: ["All Time", "This Month"]
    },
    {
      title: "Total Paid Students",
      value: "523",
      icon: "👥",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      textColor: "text-purple-700",
      valueColor: "text-purple-800"
    },
    {
      title: "Total Signups",
      value: "1892",
      icon: "📝",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      textColor: "text-yellow-700",
      valueColor: "text-yellow-800"
    },
    {
      title: "Active Courses",
      value: "16",
      icon: "🎯",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      textColor: "text-indigo-700",
      valueColor: "text-indigo-800"
    },
    {
      title: "Total Expenses",
      value: "Rs. 41,200",
      icon: "💸",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      textColor: "text-red-700",
      valueColor: "text-red-800"
    },
    {
      title: "Profit Till Now",
      value: "Rs. 100,800",
      icon: "📈",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
      valueColor: "text-emerald-800",
      hasDropdown: true,
      dropdownOptions: ["All Time", "This Month"]
    },
    {
      title: "Instructor Count",
      value: "12",
      icon: "👨‍🏫",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      textColor: "text-orange-700",
      valueColor: "text-orange-800"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-2xl">{card.icon}</div>
              {card.hasDropdown && (
                <select className="text-xs bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent">
                  {card.dropdownOptions?.map((option, optIndex) => (
                    <option key={optIndex} value={option.toLowerCase().replace(' ', '-')}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <h3 className={`text-sm font-medium ${card.textColor} mb-2`}>
                {card.title}
              </h3>
              <p className={`text-2xl font-bold ${card.valueColor}`}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Activity - Side by Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Signups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">👥</span>
              <h3 className="text-lg font-semibold text-gray-900">Today's Signups</h3>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              5 New
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  RK
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Rajesh Kumar</p>
                  <p className="text-xs text-gray-500">rajesh.kumar@email.com</p>
                </div>
                <span className="text-xs text-gray-400">10:30 AM</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  PS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Priya Sharma</p>
                  <p className="text-xs text-gray-500">priya.sharma@email.com</p>
                </div>
                <span className="text-xs text-gray-400">9:45 AM</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  AK
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Anita Khadka</p>
                  <p className="text-xs text-gray-500">anita.khadka@email.com</p>
                </div>
                <span className="text-xs text-gray-400">8:20 AM</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  ST
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Sunil Thapa</p>
                  <p className="text-xs text-gray-500">sunil.thapa@email.com</p>
                </div>
                <span className="text-xs text-gray-400">7:15 AM</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  MG
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Maya Gurung</p>
                  <p className="text-xs text-gray-500">maya.gurung@email.com</p>
                </div>
                <span className="text-xs text-gray-400">6:30 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Course Purchases */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💰</span>
              <h3 className="text-lg font-semibold text-gray-900">Today's Course Purchases</h3>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              3 Bought
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Deepak Singh</p>
                    <p className="text-xs text-gray-500">Pre-Medical Entrance 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">Rs. 1,299</p>
                    <p className="text-xs text-gray-400">11:20 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sita Rai</p>
                    <p className="text-xs text-gray-500">Engineering (IOE) Full Prep</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">Rs. 1,999</p>
                    <p className="text-xs text-gray-400">9:30 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ram Bahadur</p>
                    <p className="text-xs text-gray-500">Lok Sewa (Kharidar/Subba)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">Free</p>
                    <p className="text-xs text-gray-400">8:45 AM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue Today:</span>
                <span className="text-lg font-bold text-[#F26B1D]">Rs. 3,298</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New student enrolled</p>
                <p className="text-xs text-gray-500">Rajesh Kumar joined Pre-Medical Entrance course</p>
              </div>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">💰</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-xs text-gray-500">Rs. 1,299 payment for IOE Full Prep course</p>
              </div>
              <span className="text-xs text-gray-400">15 min ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🎓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Course completion</p>
                <p className="text-xs text-gray-500">Priya Sharma completed Lok Sewa preparation</p>
              </div>
              <span className="text-xs text-gray-400">1 hour ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-sm">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New instructor added</p>
                <p className="text-xs text-gray-500">Dr. Amit Sharma joined as Physics instructor</p>
              </div>
              <span className="text-xs text-gray-400">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    courseTitle: '',
    modeOfLecture: 'Online',
    courseThumbnail: null as File | null,
    isNewCourse: false,
    language: 'Nepali',
    shortDescription: '',
    startDate: '',
    endDate: '',
    batchInfo: '',
    originalPrice: '',
    discountedPrice: '',
    goal: 'CEE',
    // Step 2 fields
    instructorName: '',
    instructorBio: '',
    courseDescription: '',
    // Step 3 fields
    curriculum: [] as Array<{
      id: string;
      subjectName: string;
      chapters: Array<{
        id: string;
        chapterName: string;
        lessons: Array<{
          id: string;
          lessonTitle: string;
          vimeoLink?: string;
          notesFile?: File;
        }>;
      }>;
    }>
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, courseThumbnail: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      // Move to step 2
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Move to step 3
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Final submission
      console.log('Complete Course Data:', formData);
      alert('Course uploaded successfully! (This is a demo)');
    }
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      return weeks > 0 ? `${weeks} weeks${days > 0 ? ` ${days} days` : ''}` : `${days} days`;
    } else if (formData.startDate) {
      return 'Ongoing';
    }
    return 'Duration not set';
  };

  // Curriculum management functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addSubject = () => {
    const newSubject = {
      id: generateId(),
      subjectName: '',
      chapters: []
    };
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, newSubject]
    }));
  };

  const removeSubject = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter(subject => subject.id !== subjectId)
    }));
  };

  const updateSubjectName = (subjectId: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(subject =>
        subject.id === subjectId ? { ...subject, subjectName: name } : subject
      )
    }));
  };

  const addChapter = (subjectId: string) => {
    const newChapter = {
      id: generateId(),
      chapterName: '',
      lessons: []
    };
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(subject =>
        subject.id === subjectId
          ? { ...subject, chapters: [...subject.chapters, newChapter] }
          : subject
      )
    }));
  };

  const removeChapter = (subjectId: string, chapterId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(subject =>
        subject.id === subjectId
          ? { ...subject, chapters: subject.chapters.filter(chapter => chapter.id !== chapterId) }
          : subject
      )
    }));
  };

  const updateChapterName = (subjectId: string, chapterId: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              chapters: subject.chapters.map(chapter =>
                chapter.id === chapterId ? { ...chapter, chapterName: name } : chapter
              )
            }
          : subject
      )
    }));
  };

  const addLesson = (subjectId: string, chapterId: string) => {
    const newLesson = {
      id: generateId(),
      lessonTitle: '',
      vimeoLink: '',
      notesFile: undefined
    };
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              chapters: subject.chapters.map(chapter =>
                chapter.id === chapterId
                  ? { ...chapter, lessons: [...chapter.lessons, newLesson] }
                  : chapter
              )
            }
          : subject
      )
    }));
  };

  const removeLesson = (subjectId: string, chapterId: string, lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              chapters: subject.chapters.map(chapter =>
                chapter.id === chapterId
                  ? { ...chapter, lessons: chapter.lessons.filter(lesson => lesson.id !== lessonId) }
                  : chapter
              )
            }
          : subject
      )
    }));
  };

  const updateLesson = (subjectId: string, chapterId: string, lessonId: string, field: string, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              chapters: subject.chapters.map(chapter =>
                chapter.id === chapterId
                  ? {
                      ...chapter,
                      lessons: chapter.lessons.map(lesson =>
                        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
                      )
                    }
                  : chapter
              )
            }
          : subject
      )
    }));
  };

  const modeOptions = ['Online', 'Offline'];
  const languageOptions = ['Nepali', 'English', 'Hinglish'];
  const goalOptions = ['CEE', 'IOE', 'Lok Sewa', 'Class 12 Board', 'Language', 'License'];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep >= 1 ? 'bg-[#F26B1D] text-white' : 'bg-gray-200 text-gray-600'
        } font-semibold text-sm`}>
          1
        </div>
        <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-[#F26B1D]' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep >= 2 ? 'bg-[#F26B1D] text-white' : 'bg-gray-200 text-gray-600'
        } font-semibold text-sm`}>
          2
        </div>
        <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-[#F26B1D]' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep >= 3 ? 'bg-[#F26B1D] text-white' : 'bg-gray-200 text-gray-600'
        } font-semibold text-sm`}>
          3
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {currentStep === 1 ? 'Course Upload Form' : 
             currentStep === 2 ? 'Course Landing Page Details' : 
             'Curriculum Builder'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {currentStep === 1 ? 'Step 1: Course Card Information' : 
             currentStep === 2 ? 'Step 2: Description & Instructor Info' : 
             'Step 3: Curriculum'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {currentStep === 1 && (
            <>
              {/* Course Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                  placeholder="e.g., Complete Lok Sewa GK Course 2025 Full Preparation"
                  required
                />
              </div>

              {/* Mode and Language - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode of Video Lecture *
              </label>
              <select
                name="modeOfLecture"
                value={formData.modeOfLecture}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
              >
                {modeOptions.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
              >
                {languageOptions.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>
            <input
              type="file"
              name="courseThumbnail"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
            />
            {thumbnailPreview && (
              <div className="mt-3">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* New Course Checkbox and Goal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isNewCourse"
                  checked={formData.isNewCourse}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#F26B1D] border-gray-300 rounded focus:ring-[#F26B1D]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as New Course (adds NEW tag)
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Category *
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
              >
                {goalOptions.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
              placeholder="Brief description that appears on the course card"
              required
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
              />
            </div>
          </div>

          {/* Batch Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Information
            </label>
            <input
              type="text"
              name="batchInfo"
              value={formData.batchInfo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
              placeholder="e.g., For Full Batch, Class 12 Students"
            />
          </div>

          {/* Pricing Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (Rs.) *
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                  placeholder="1999"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discounted Price (Rs.) *
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                  placeholder="1299"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Price Preview */}
            {formData.originalPrice && formData.discountedPrice && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Price Display Preview:</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#F26B1D]">Rs.{formData.discountedPrice}</span>
                  {parseInt(formData.originalPrice) > parseInt(formData.discountedPrice) && (
                    <span className="text-sm text-gray-500 line-through">Rs.{formData.originalPrice}</span>
                  )}
                </div>
                {parseInt(formData.originalPrice) > parseInt(formData.discountedPrice) && (
                  <div className="text-xs text-green-600 font-medium mt-1">
                    ✅ {Math.round(((parseInt(formData.originalPrice) - parseInt(formData.discountedPrice)) / parseInt(formData.originalPrice)) * 100)}% off applied
                  </div>
                )}
              </div>
            )}
          </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Read-only Preview Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Course Overview (from Step 1)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Course Title:</p>
                    <p className="text-gray-900">{formData.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Language:</p>
                    <p className="text-gray-900">{formData.language}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duration:</p>
                    <p className="text-gray-900">{calculateDuration()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Price:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#F26B1D]">Rs.{formData.discountedPrice}</span>
                      {parseInt(formData.originalPrice) > parseInt(formData.discountedPrice) && (
                        <span className="text-sm text-gray-500 line-through">Rs.{formData.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
                {thumbnailPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Course Thumbnail:</p>
                    <img
                      src={thumbnailPreview}
                      alt="Course thumbnail"
                      className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Instructor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  name="instructorName"
                  value={formData.instructorName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                  placeholder="e.g., Dev Raj Mandal"
                  required
                />
              </div>

              {/* Instructor Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Bio *
                </label>
                <textarea
                  name="instructorBio"
                  value={formData.instructorBio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                  placeholder="Brief biography of the instructor including experience, qualifications, and teaching methodology..."
                  required
                />
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                  placeholder="Detailed course description including what students will learn, course objectives, prerequisites, and benefits..."
                  required
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              {/* Course Title Preview */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Course: {formData.courseTitle}</h4>
                <p className="text-sm text-gray-600">Build your course curriculum by adding subjects, chapters, and lessons.</p>
              </div>

              {/* Curriculum Builder */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Curriculum Structure</h4>
                  <button
                    type="button"
                    onClick={addSubject}
                    className="px-4 py-2 bg-[#F26B1D] text-white rounded-lg hover:bg-[#D72638] transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>+</span> Add Subject
                  </button>
                </div>

                {formData.curriculum.map((subject, subjectIndex) => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    {/* Subject Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={subject.subjectName}
                          onChange={(e) => updateSubjectName(subject.id, e.target.value)}
                          placeholder="Subject name (e.g., Physics, Chemistry)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent font-medium"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addChapter(subject.id)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                      >
                        + Add Chapter
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSubject(subject.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Chapters */}
                    <div className="ml-6 space-y-4">
                      {subject.chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                          {/* Chapter Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={chapter.chapterName}
                                onChange={(e) => updateChapterName(subject.id, chapter.id, e.target.value)}
                                placeholder="Chapter name (e.g., Motion, Acids & Bases)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => addLesson(subject.id, chapter.id)}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors duration-200"
                            >
                              + Add Lesson
                            </button>
                            <button
                              type="button"
                              onClick={() => removeChapter(subject.id, chapter.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Lessons */}
                          <div className="ml-6 space-y-3">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                                <div className="grid grid-cols-1 gap-3">
                                  {/* Lesson Title */}
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={lesson.lessonTitle}
                                      onChange={(e) => updateLesson(subject.id, chapter.id, lesson.id, 'lessonTitle', e.target.value)}
                                      placeholder="Lesson title"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeLesson(subject.id, chapter.id, lesson.id)}
                                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors duration-200"
                                    >
                                      ×
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Vimeo Link */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vimeo Video Link (Optional)
                                      </label>
                                      <input
                                        type="url"
                                        value={lesson.vimeoLink || ''}
                                        onChange={(e) => updateLesson(subject.id, chapter.id, lesson.id, 'vimeoLink', e.target.value)}
                                        placeholder="https://vimeo.com/..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent text-sm"
                                      />
                                    </div>

                                    {/* Notes/PDF Upload */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes/PDF (Optional)
                                      </label>
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            updateLesson(subject.id, chapter.id, lesson.id, 'notesFile', file);
                                          }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:border-transparent text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {formData.curriculum.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No subjects added yet. Click "Add Subject" to start building your curriculum.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {(currentStep === 2 || currentStep === 3) && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-[#F26B1D] text-white font-semibold rounded-lg hover:bg-[#D72638] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F26B1D] focus:ring-offset-2 ml-auto"
            >
              {currentStep === 1 ? 'Next' : currentStep === 2 ? 'Next' : 'Save Curriculum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const NotesContent = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'notes' | 'formulas'>('notes');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    chapterName: '',
    label: 'Note' as 'Note' | 'Formula' | 'Derivation',
    subjectName: '',
    goals: [] as string[],
    cost: '',
    driveLink: '',
    isPublished: false
  });

  // New states for pagination, filtering, and bulk actions
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const limit = 20;

  // Fetch paginated notes using React Query
  const { data: paginatedData, isLoading } = useQuery({
    queryKey: ['/api/admin/notes/paginated', currentPage, searchTerm, goalFilter, subjectFilter, activeTab],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        activeTab: activeTab, // Include activeTab in API call
        ...(searchTerm && { search: searchTerm }),
        ...(goalFilter && { goal: goalFilter }),
        ...(subjectFilter && { subject: subjectFilter })
      });
      
      const response = await fetch(`/api/admin/notes/paginated?${params}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      return response.json();
    }
  });

  // Fetch unique subjects for filter dropdown
  const { data: availableSubjectsFromDB = [] } = useQuery({
    queryKey: ['/api/admin/notes/subjects'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notes/subjects');
      if (!response.ok) throw new Error('Failed to fetch subjects');
      return response.json();
    }
  });

  // Data is already filtered by backend based on activeTab and other filters
  const notes = paginatedData?.notes || [];
  const totalNotes = paginatedData?.total || 0;
  const totalPages = Math.ceil(totalNotes / limit);

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: typeof formData) => {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
      if (!response.ok) throw new Error('Failed to create note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes/paginated'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setShowCreateForm(false);
      resetForm();
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      const response = await fetch(`/api/admin/notes/${noteId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes/paginated'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setSelectedNotes([]);
      setSelectAll(false);
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const response = await fetch(`/api/admin/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes/paginated'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setShowCreateForm(false);
      setEditingNote(null);
      resetForm();
    }
  });

  // Add bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await fetch('/api/admin/notes/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) throw new Error('Failed to delete notes');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notes/paginated'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setSelectedNotes([]);
      setSelectAll(false);
    }
  });

  const resetForm = () => {
    setFormData({
      chapterName: '',
      label: activeTab === 'notes' ? 'Note' : 'Formula',
      subjectName: '',
      goals: [],
      cost: '',
      driveLink: '',
      isPublished: false
    });
    setEditingNote(null);
  };

  // Selection handlers for bulk actions
  const handleSelectNote = (noteId: number) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notes.map(note => note.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = () => {
    if (selectedNotes.length === 0) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedNotes.length} selected notes?`);
    if (confirmDelete) {
      bulkDeleteMutation.mutate(selectedNotes);
    }
  };

  // Update selectAll state when notes or selectedNotes change
  useEffect(() => {
    if (notes.length > 0) {
      const allSelected = notes.every(note => selectedNotes.includes(note.id));
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [notes, selectedNotes]);

  // Dynamic subject filtering based on selected goal
  const [availableSubjectsForGoal, setAvailableSubjectsForGoal] = useState<string[]>([]);

  // Fetch goals and subjects from API
  const { data: goals = [] } = useQuery({
    queryKey: ['/api/goals'],
    queryFn: async () => {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    },
  });

  const { data: allSubjects = [] } = useQuery({
    queryKey: ['/api/subjects'],
    queryFn: async () => {
      const response = await fetch('/api/subjects');
      if (!response.ok) throw new Error('Failed to fetch subjects');
      return response.json();
    },
  });

  // Update available subjects when goalFilter changes
  useEffect(() => {
    if (goalFilter) {
      const selectedGoal = goals.find(g => g.name === goalFilter);
      if (selectedGoal) {
        const subjectsForGoal = allSubjects
          .filter(s => s.goalId === selectedGoal.id)
          .map(s => s.name);
        setAvailableSubjectsForGoal(subjectsForGoal);
        
        // Reset subject filter if current selection is not valid for the selected goal
        if (subjectFilter && !subjectsForGoal.includes(subjectFilter)) {
          setSubjectFilter('');
        }
      }
    } else {
      setAvailableSubjectsForGoal(availableSubjectsFromDB);
    }
  }, [goalFilter, goals, allSubjects, availableSubjectsFromDB, subjectFilter]);

  const getCreateButtonText = () => {
    return activeTab === 'notes' ? 'Create Note' : 'Create Formula/Derivation';
  };

  const getTabTitle = () => {
    return activeTab === 'notes' ? 'Notes' : 'Formulas & Derivations';
  };

  const handleTabChange = (tab: 'notes' | 'formulas') => {
    setActiveTab(tab);
    if (showCreateForm) {
      setShowCreateForm(false);
      resetForm();
    }
    setCurrentPage(1); // Reset to first page when changing tabs
    setSelectedNotes([]); // Clear selections when changing tabs
    setSelectAll(false);
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const handleDeleteNote = (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    setFormData({
      chapterName: note.chapterName,
      label: note.label,
      subjectName: note.subjectName,
      goals: note.goals,
      cost: note.cost,
      driveLink: note.driveLink || '',
      isPublished: note.isPublished
    });
    setShowCreateForm(true);
  };

  // Search and filter handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (type: 'goal' | 'subject', value: string) => {
    if (type === 'goal') {
      setGoalFilter(value);
    } else {
      setSubjectFilter(value);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote.id, data: formData });
    } else {
      createNoteMutation.mutate(formData);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const availableGoals = goals.map(g => g.name);

  const getAvailableSubjects = () => {
    if (formData.goals.length === 0) {
      return allSubjects.map(s => s.name);
    }
    const subjects = new Set<string>();
    formData.goals.forEach(goalName => {
      const goal = goals.find(g => g.name === goalName);
      if (goal) {
        allSubjects
          .filter(s => s.goalId === goal.id)
          .forEach(subject => subjects.add(subject.name));
      }
    });
    return Array.from(subjects);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes Management</h1>
          <p className="text-gray-600">Manage your educational notes, formulas and derivations</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {getCreateButtonText()}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('notes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'notes'
                ? 'border-[#F26B1D] text-[#F26B1D]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📘 Notes
          </button>
          <button
            onClick={() => handleTabChange('formulas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'formulas'
                ? 'border-[#F26B1D] text-[#F26B1D]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🧪 Formulas & Derivations
          </button>
        </nav>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
            />
          </div>

          {/* Goal Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Goal</label>
            <select
              value={goalFilter}
              onChange={(e) => handleFilterChange('goal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
            >
              <option value="">All Goals</option>
              {availableGoals.map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
            >
              <option value="">All Subjects</option>
              {availableSubjectsForGoal.map((subject: string) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-blue-800 font-medium">
              {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{getTabTitle()} ({totalNotes})</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#F26B1D] focus:ring-[#F26B1D]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notes.map((note: any) => (
                  <tr key={note.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedNotes.includes(note.id)}
                        onChange={() => handleSelectNote(note.id)}
                        className="rounded border-gray-300 text-[#F26B1D] focus:ring-[#F26B1D]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{note.chapterName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        note.label === 'Note' ? 'bg-blue-100 text-blue-800' :
                        note.label === 'Formula' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {note.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{note.subjectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {note.goals.map((goal: string) => (
                          <span key={goal} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{note.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        note.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {note.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditNote(note)}
                        className="text-[#F26B1D] hover:text-[#D72638] mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={deleteNoteMutation.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalNotes)} of {totalNotes} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-[#F26B1D] text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingNote ? 
                    `Edit ${editingNote.label}` : 
                    (activeTab === 'notes' ? 'Create New Note' : 'Create New Formula/Derivation')
                  }
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.chapterName}
                  onChange={(e) => setFormData(prev => ({ ...prev, chapterName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                {activeTab === 'notes' ? (
                  <input
                    type="text"
                    value="Note"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                ) : (
                  <select
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
                  >
                    <option value="Formula">Formula</option>
                    <option value="Derivation">Derivation</option>
                  </select>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={formData.subjectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
                  required
                >
                  <option value="">Select Subject</option>
                  {getAvailableSubjects().map((subject, index) => (
                    <option key={`${subject}-${index}`} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableGoals.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        formData.goals.includes(goal)
                          ? 'bg-[#F26B1D] text-white border-[#F26B1D]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#F26B1D]'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="Free or ₹99"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
                  required
                />
              </div>

              {/* Google Drive Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Drive View-Only Link</label>
                <input
                  type="url"
                  value={formData.driveLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26B1D]"
                />
              </div>

              {/* Publish Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="publish"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 text-[#F26B1D] focus:ring-[#F26B1D] border-gray-300 rounded"
                />
                <label htmlFor="publish" className="ml-2 block text-sm text-gray-900">
                  Publish immediately (make visible on website)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#F26B1D] border border-transparent rounded-md hover:bg-[#D72638] disabled:opacity-50"
                >
                  {editingNote ? 
                    (updateNoteMutation.isPending ? 'Updating...' : 'Update Note') :
                    (createNoteMutation.isPending ? 'Creating...' : 'Create Note')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
const UsersContent = () => <PlaceholderContent section="users management" />;
const InstructorsContent = () => <PlaceholderContent section="instructors management" />;
const HeroSectionContent = () => <PlaceholderContent section="hero section editor" />;
const StatsSectionContent = () => <PlaceholderContent section="stats section editor" />;
const CourseCategoriesContent = () => <PlaceholderContent section="course categories" />;
const TestimonialsContent = () => <PlaceholderContent section="testimonials management" />;
const FooterSocialsContent = () => <PlaceholderContent section="footer and socials" />;
const ReportsContent = () => <PlaceholderContent section="reports and analytics" />;
const SettingsContent = () => <PlaceholderContent section="system settings" />;

// Admin authentication hook
function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<{email: string} | null>(null);
  const [authKey, setAuthKey] = useState(0); // Force re-render trigger

  useEffect(() => {
    // Don't auto-check auth on page load - always start with login form
    setIsLoading(false);
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setAdmin(data.admin);
      } else {
        setIsAuthenticated(false);
        setAdmin(null);
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      setIsAuthenticated(false);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, redirecting to dashboard');
        
        // Force redirect to admin dashboard - bypass React state issues
        window.location.href = '/admin/dashboard';
        
        return { success: true };
      } else {
        const error = await response.json();
        console.log('Login failed:', error);
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Admin logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setAdmin(null);
      // Reload page to ensure clean state
      window.location.reload();
    }
  };

  return { isAuthenticated, isLoading, admin, login, logout, authKey };
}

// Admin Login Component
function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Login successful - redirect will happen automatically
        // Keep loading state until redirect completes
      } else {
        setError(result.error || 'Invalid credentials');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#F26B1D] mb-2">Vaani Admin</h2>
          <p className="text-lg text-gray-600">Secure Admin Portal</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border-t-4 border-[#F26B1D]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#F26B1D] focus:border-[#F26B1D] sm:text-sm"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#F26B1D] focus:border-[#F26B1D] sm:text-sm"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F26B1D] hover:bg-[#D72638] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26B1D] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in to Admin Panel'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Authorized personnel only. All access is logged and monitored.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  // Direct access to admin dashboard without authentication
  return (
    <AdminLayout>
      <div className="h-full">
        {/* Admin dashboard content rendered by the layout */}
      </div>
    </AdminLayout>
  );
}