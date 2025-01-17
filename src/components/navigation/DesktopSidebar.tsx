import { Link } from "react-router-dom";
import NavigationItem from "./NavigationItem";
import type { LucideIcon } from "lucide-react";

interface DesktopSidebarProps {
  navigation: {
    name: string;
    href: string;
    icon: LucideIcon;
    isAction?: boolean;
  }[];
  currentPath: string;
  onActionClick: () => void;
}

const DesktopSidebar = ({ navigation, currentPath, onActionClick }: DesktopSidebarProps) => {
  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <h1 className="text-xl font-bold text-assistant-primary">Personal Assistant</h1>
        </div>
        <div className="mt-8 flex flex-grow flex-col">
          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <NavigationItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                isActive={currentPath === item.href}
                isAction={item.isAction}
                onActionClick={onActionClick}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;