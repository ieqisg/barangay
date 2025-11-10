import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu, X, Home, FileText, Users, LogOut } from 'lucide-react';
import { getCurrentUser, logout as doLogout, onAuthChange } from '../../lib/auth';
import { getNotifications, onNotifications } from '../../lib/requests';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [logoutOpen, setLogoutOpen] = useState(false); // logout popup
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(getCurrentUser());
  const [notifications, setNotifications] = useState(() => getNotifications(user?.id));

  useEffect(() => {
    const unsubAuth = onAuthChange((u) => setUser(u));
    const unsubNot = onNotifications((n) => setNotifications(n));
    // initial load
    setNotifications(getNotifications(user?.id));
    return () => {
      unsubAuth();
      unsubNot();
    };
  }, []);

  const handleLogout = () => {
    doLogout();
    setLogoutOpen(false);
    navigate('/login');
  };

  const getInitials = (firstName, lastName) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    const baseItems = [{ path: '/', label: 'Dashboard', icon: Home }];
    if (!user) return baseItems;

    if (user.role === 'resident') {
      return [...baseItems, { path: '/submit-request', label: 'Submit Request', icon: FileText }];
    }

    if (user.role === 'staff' || user.role === 'admin') {
      return [
        ...baseItems,
        { path: '/staff', label: 'Manage Requests', icon: FileText },
        ...(user.role === 'admin' ? [{ path: '/admin', label: 'Admin Panel', icon: Users }] : []),
      ];
    }

    return baseItems;
  };

  if (!user) return null;

  const unread = (notifications || []).filter(n => !n.read && (n.userId === null || n.userId === user.id)).length;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BR</span>
            </div>
            <span className="font-semibold text-gray-900">Barangay Request System</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-gray-100" title="Notifications">
              <Bell className="w-5 h-5" />
              {unread > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>

            {/* Avatar & Logout Pop-up */}
            <div className="relative">
              <button
                onClick={() => setLogoutOpen(!logoutOpen)}
                className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"
              >
                {getInitials(user.firstName, user.lastName)}
              </button>

              {logoutOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50">
                  <div className="p-2 border-b">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
