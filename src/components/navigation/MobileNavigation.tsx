import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface MobileNavigationProps {
  navigation: {
    name: string;
    href: string;
    icon: LucideIcon;
    isAction?: boolean;
  }[];
  currentPath: string;
  onActionClick: () => void;
}

const MobileNavigation = ({ navigation, currentPath, onActionClick }: MobileNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <nav className="flex justify-around p-2">
        {navigation.map((item) => {
          const isActive = currentPath === item.href;
          if (item.isAction) {
            return (
              <button
                key="action"
                onClick={onActionClick}
                className="flex flex-col items-center px-2 py-1"
              >
                <item.icon className="h-8 w-8 text-assistant-primary" />
              </button>
            );
          }
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
  );
};

export default MobileNavigation;