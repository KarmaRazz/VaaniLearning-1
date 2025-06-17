import { useState } from 'react';
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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'notes-quizzes', label: 'Notes & Quizzes', icon: FileText },
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
      case 'notes-quizzes':
        return <NotesQuizzesContent />;
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

const DashboardContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
        <p className="text-3xl font-bold text-[#F26B1D]">5,432</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Active Courses</h3>
        <p className="text-3xl font-bold text-[#F26B1D]">24</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Instructors</h3>
        <p className="text-3xl font-bold text-[#F26B1D]">12</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
        <p className="text-3xl font-bold text-[#F26B1D]">₹2.1M</p>
      </div>
    </div>
    <PlaceholderContent section="dashboard details" />
  </div>
);

const CoursesContent = () => <PlaceholderContent section="courses management" />;
const NotesQuizzesContent = () => <PlaceholderContent section="notes and quizzes" />;
const UsersContent = () => <PlaceholderContent section="users management" />;
const InstructorsContent = () => <PlaceholderContent section="instructors management" />;
const HeroSectionContent = () => <PlaceholderContent section="hero section editor" />;
const StatsSectionContent = () => <PlaceholderContent section="stats section editor" />;
const CourseCategoriesContent = () => <PlaceholderContent section="course categories" />;
const TestimonialsContent = () => <PlaceholderContent section="testimonials management" />;
const FooterSocialsContent = () => <PlaceholderContent section="footer and socials" />;
const ReportsContent = () => <PlaceholderContent section="reports and analytics" />;
const SettingsContent = () => <PlaceholderContent section="system settings" />;

export default function AdminPanel() {
  return (
    <AdminLayout>
      <div className="h-full">
        {/* Content will be rendered by the layout */}
      </div>
    </AdminLayout>
  );
}