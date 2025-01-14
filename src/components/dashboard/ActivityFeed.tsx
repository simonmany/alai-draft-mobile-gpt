import { ScrollArea } from "@/components/ui/scroll-area";

type Activity = {
  id: number;
  user: string;
  action: string;
  time: string;
  type: 'fitness' | 'wellness';
};

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <ScrollArea className="h-48 w-full rounded-md">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start space-x-3 p-2 rounded-md hover:bg-assistant-muted/50 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-assistant-muted flex items-center justify-center flex-shrink-0">
              <span className="text-assistant-primary font-medium">
                {activity.user.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium text-gray-900">{activity.user}</span>
                {" "}
                <span className="text-gray-600">{activity.action}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            <div 
              className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'fitness' ? 'bg-assistant-primary' : 'bg-assistant-secondary'
              }`} 
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ActivityFeed;