import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Calendar, Users, User, Home, Plus } from "lucide-react";
import DesktopSidebar from "./navigation/DesktopSidebar";
import MobileNavigation from "./navigation/MobileNavigation";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "", href: "#", icon: Plus, isAction: true },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "You", href: "/goals", icon: User },
  ];

  const handlePlanningClick = () => {
    const planButton = document.querySelector('button[aria-label="Let\'s Plan Something"]') as HTMLButtonElement;
    if (planButton) {
      planButton.click();
    }
  };

  return (
    <div className="min-h-screen bg-assistant-background">
      <DesktopSidebar 
        navigation={navigation} 
        currentPath={location.pathname}
        onActionClick={handlePlanningClick}
      />

      <MobileNavigation 
        navigation={navigation}
        currentPath={location.pathname}
        onActionClick={handlePlanningClick}
      />

      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:px-8 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;