import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Calendar, Users, Activity, LayoutDashboard, Dumbbell } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Activities", href: "/activities", icon: Dumbbell },
    { name: "Health", href: "/health", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-assistant-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-assistant-primary">Personal Assistant</h1>
          </div>
          <div className="mt-8 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? "bg-assistant-muted text-assistant-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-assistant-primary" : "text-gray-400 group-hover:text-gray-500"
                      } mr-3 h-5 w-5 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <nav className="flex justify-around p-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive ? "text-assistant-primary" : "text-gray-400"
                } flex flex-col items-center px-2 py-1`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:px-8 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;