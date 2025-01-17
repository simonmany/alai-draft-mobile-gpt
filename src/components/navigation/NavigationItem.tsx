import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  isAction?: boolean;
  onActionClick?: () => void;
}

const NavigationItem = ({ 
  name, 
  href, 
  icon: Icon, 
  isActive, 
  isAction,
  onActionClick 
}: NavigationItemProps) => {
  if (isAction) {
    return (
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault();
          onActionClick?.();
        }}
        className="flex items-center justify-center py-4"
      >
        <Icon className="h-8 w-8 text-assistant-primary hover:text-assistant-primary/80" />
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className={`${
        isActive
          ? "bg-assistant-muted text-assistant-primary"
          : "text-gray-600 hover:bg-gray-50"
      } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
    >
      <Icon
        className={`${
          isActive ? "text-assistant-primary" : "text-gray-400 group-hover:text-gray-500"
        } mr-3 h-5 w-5 flex-shrink-0`}
      />
      {name}
    </Link>
  );
};

export default NavigationItem;