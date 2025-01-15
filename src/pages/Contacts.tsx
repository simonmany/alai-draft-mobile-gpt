import ContactsOrbit from "@/components/ContactsOrbit";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface ContactGroup {
  id: string;
  name: string;
  count: number;
  color: string;
}

const Contacts = () => {
  const contactGroups: ContactGroup[] = [
    { id: "inner", name: "Inner Orbit", count: 5, color: "#9b87f5" },
    { id: "college", name: "College Friends", count: 8, color: "#7E69AB" },
    { id: "work", name: "Work Friends", count: 12, color: "#6E59A5" },
    { id: "golf", name: "Golf Friends", count: 6, color: "#D6BCFA" },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Network</h1>
      </div>
      
      <ContactsOrbit />
      
      {/* Contact Groups Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactGroups.map((group) => (
            <Card 
              key={group.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderColor: group.color }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${group.color}20` }}
                >
                  <Users className="h-5 w-5" style={{ color: group.color }} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.count} contacts</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contacts;