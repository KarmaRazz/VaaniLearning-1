import { BarChart3, Users, BookOpen, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Students', value: '5,432', icon: Users, change: '+12%' },
    { label: 'Active Courses', value: '24', icon: BookOpen, change: '+3%' },
    { label: 'Monthly Revenue', value: '₹2.1M', icon: TrendingUp, change: '+18%' },
    { label: 'Completion Rate', value: '87%', icon: BarChart3, change: '+5%' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} from last month</p>
              </div>
              <div className="h-12 w-12 bg-[#F26B1D]/10 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-[#F26B1D]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New student registered</p>
                <p className="text-xs text-gray-500">Rajesh Kumar joined Pre-Medical course</p>
              </div>
              <span className="text-xs text-gray-400 ml-auto">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Course completed</p>
                <p className="text-xs text-gray-500">Priya Sharma finished Lok Sewa preparation</p>
              </div>
              <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Revenue milestone reached</p>
                <p className="text-xs text-gray-500">Monthly target achieved 5 days early</p>
              </div>
              <span className="text-xs text-gray-400 ml-auto">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}