import { useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { Calendar, Users, User, Home, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DesktopSidebar from "./navigation/DesktopSidebar";
import MobileNavigation from "./navigation/MobileNavigation";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "", href: "#", icon: Plus, isAction: true },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "You", href: "/goals", icon: User },
    { 
      name: "Sign Out", 
      href: "#",
      icon: LogOut,
      onClick: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({
            variant: "destructive",
            title: "Error signing out",
            description: error.message,
          });
        } else {
          navigate("/auth");
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
        }
      }
    }
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