import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

type ActiveTab = 'dashboard' | 'find-partners' | 'sessions' | 'messages' | 'profile';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.sidebar') && !target.closest('.menu-button')) {
          setIsMobileMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  };

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: Home },
    { id: 'find-partners' as ActiveTab, label: 'Find Partners', icon: Search },
    { id: 'sessions' as ActiveTab, label: 'My Sessions', icon: Calendar },
    { id: 'messages' as ActiveTab, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LenguaX
        </h1>
        <button
          className="menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </header>

      {/* Backdrop Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } pt-16 md:pt-6 flex flex-col`}
      >
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LenguaX
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || 'User'}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {getInitials(user?.full_name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.full_name || 'User'}!
                </h1>
                <p className="text-gray-600">
                  Here's an overview of your language exchange activity.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
                  <p className="text-gray-600 text-sm">Sessions Scheduled</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
                  <p className="text-gray-600 text-sm">Messages</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Search className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
                  <p className="text-gray-600 text-sm">Partners</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleNavClick('find-partners')}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Find Language Partners
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Find Partners Tab */}
          {activeTab === 'find-partners' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Find Partners
                </h2>
                <p className="text-gray-600">Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Search for language exchange partners based on your learning goals.
                </p>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  My Sessions
                </h2>
                <p className="text-gray-600">Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  View and manage your scheduled language exchange sessions.
                </p>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Messages
                </h2>
                <p className="text-gray-600">Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Chat with your language exchange partners.
                </p>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Profile Settings
                </h2>
                <p className="text-gray-600">Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Manage your profile, languages, and preferences.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

