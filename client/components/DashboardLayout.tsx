import { useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  Clock,
  PenTool,
  Layers,
  UserCog,
  Shield,
  ShieldAlert,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Download,
  Upload,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export function DashboardLayout({ children, activeTab = 'dashboard' }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is approved for teacher roles
    if (user && !user.isApproved && ['hod', 'class_teacher', 'subject_teacher'].includes(user.userType)) {
      navigate('/pending-approval', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-based menu items
  const getMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    ];

    switch (user.userType) {
      case 'planner':
        return [
          ...baseItems,
          { id: 'classes', label: 'Class Management', icon: BookOpen, path: '/dashboard/admin/classes' },
          { id: 'teachers', label: 'Teacher Management', icon: Users, path: '/dashboard/admin/teachers' },
          { id: 'pending-approvals', label: 'Pending Approvals', icon: UserCheck, path: '/dashboard/admin/pending-approvals' },
          { id: 'results', label: 'Results Analysis', icon: BarChart3, path: '/dashboard/admin/results-analysis' },
          { id: 'reports', label: 'Report Cards', icon: FileText, path: '/dashboard/admin/report-cards' },
          { id: 'import', label: 'Import Data', icon: Upload, path: '/dashboard/admin/import' },
          { id: 'export', label: 'Export Data', icon: Download, path: '/dashboard/admin/export' },
        ];

      case 'headteacher':
      case 'deputy':
        return [
          ...baseItems,
          { id: 'classes', label: 'Class Management', icon: BookOpen, path: '/dashboard/admin/classes' },
          { id: 'teachers', label: 'Teacher Management', icon: Users, path: '/dashboard/admin/teachers' },
          { id: 'results', label: 'Results Analysis', icon: BarChart3, path: '/dashboard/admin/results-analysis' },
          { id: 'reports', label: 'Report Cards', icon: FileText, path: '/dashboard/admin/report-cards' },
          { id: 'overview', label: 'Attendance Overview', icon: Clock, path: '/dashboard/admin/attendance-overview' },
        ];

      case 'hod':
        return [
          ...baseItems,
          { id: 'department', label: 'Department Performance', icon: Layers, path: '/dashboard/hod/department-performance' },
          { id: 'teachers', label: 'Department Teachers', icon: Users, path: '/dashboard/hod/department-teachers' },
          { id: 'attendance', label: 'Attendance Tracking', icon: Clock, path: '/dashboard/teacher/attendance' },
          { id: 'results-entry', label: 'Results Entry', icon: PenTool, path: '/dashboard/teacher/results-entry' },
          { id: 'analysis', label: 'Results Analysis', icon: BarChart3, path: '/dashboard/teacher/results-analysis' },
        ];

      case 'class_teacher':
        return [
          ...baseItems,
          { id: 'daily-attendance', label: 'Daily Attendance', icon: Clock, path: '/dashboard/class-teacher/daily-attendance' },
          { id: 'class-performance', label: 'Class Performance', icon: BarChart3, path: '/dashboard/class-teacher/class-performance' },
          { id: 'results-entry', label: 'Results Entry', icon: PenTool, path: '/dashboard/teacher/results-entry' },
          { id: 'analysis', label: 'Results Analysis', icon: BarChart3, path: '/dashboard/teacher/results-analysis' },
        ];

      case 'subject_teacher':
        return [
          ...baseItems,
          { id: 'subjects', label: 'Subject Performance', icon: BookOpen, path: '/dashboard/subject-teacher/subject-performance' },
          { id: 'timetable', label: 'My Timetable', icon: Clock, path: '/dashboard/subject-teacher/my-timetable' },
          { id: 'attendance', label: 'Attendance Tracking', icon: Clock, path: '/dashboard/teacher/attendance' },
          { id: 'results-entry', label: 'Results Entry', icon: PenTool, path: '/dashboard/teacher/results-entry' },
          { id: 'analysis', label: 'Results Analysis', icon: BarChart3, path: '/dashboard/teacher/results-analysis' },
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  // Get role display info
  const getRoleInfo = () => {
    if (!user) return { label: 'User', icon: Users, color: 'gray' };

    const roleMap: Record<string, { label: string; icon: any; color: string }> = {
      planner: { label: 'Planner', icon: UserCog, color: 'blue' },
      headteacher: { label: 'Head Teacher', icon: Shield, color: 'purple' },
      deputy: { label: 'Deputy Head', icon: ShieldAlert, color: 'indigo' },
      hod: { label: 'Head of Department', icon: Layers, color: 'green' },
      class_teacher: { label: 'Class Teacher', icon: Users, color: 'orange' },
      subject_teacher: { label: 'Subject Teacher', icon: BookOpen, color: 'teal' },
    };

    return roleMap[user.userType] || { label: user.userType, icon: Users, color: 'gray' };
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Show pending approval banner for unapproved teachers
  const showApprovalBanner = user && !user.isApproved && ['hod', 'class_teacher', 'subject_teacher'].includes(user.userType);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo & Close Button */}
        <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
              K
            </div>
            <span className="font-bold text-sm">KalaboBoarding</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${roleInfo.color}-600 rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <RoleIcon size={12} className={`text-${roleInfo.color}-400`} />
                <p className="text-xs text-gray-300 truncate">{roleInfo.label}</p>
              </div>
            </div>
          </div>
          
          {/* Approval Status Badge */}
          {showApprovalBanner && (
            <div className="mt-3 p-2 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="text-xs text-amber-300">Pending Approval</span>
            </div>
          )}
          
          {user?.isApproved && user?.userType !== 'planner' && user?.userType !== 'headteacher' && user?.userType !== 'deputy' && (
            <div className="mt-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
              <CheckCircle size={14} className="text-green-400" />
              <span className="text-xs text-green-300">Approved</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? `bg-${roleInfo.color}-600 text-white shadow-md`
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
                {item.id === 'pending-approvals' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="p-3 border-t border-gray-700/50 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 text-sm">
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 text-sm"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-700 capitalize">{activeTab.replace('-', ' ')}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {showApprovalBanner && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle size={14} className="text-amber-600" />
                <span className="text-xs text-amber-700">Awaiting approval</span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}