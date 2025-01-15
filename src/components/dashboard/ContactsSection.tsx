import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlanningDialog from "./PlanningDialog";

type Contact = {
  id: number;
  name: string;
  status: string;
  needsAttention: boolean;
};

interface ContactsSectionProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
}

const ContactsSection = ({ contacts }: ContactsSectionProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
          <Link to="/contacts" className="text-assistant-primary hover:text-assistant-primary/80 transition-colors">
            <Users className="h-7 w-7" />
          </Link>
        </div>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <PlanningDialog
              key={contact.id}
              initialPerson={contact.name}
              trigger={
                <div 
                  className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                    contact.needsAttention 
                      ? 'bg-assistant-muted/50 hover:bg-assistant-muted' 
                      : 'hover:bg-assistant-muted/50'
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-assistant-muted flex items-center justify-center">
                    <span className="text-assistant-primary font-medium">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.status}</p>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </Card>
      <PlanningDialog
        trigger={
          <Button 
            variant="outline" 
            className="w-full bg-white hover:bg-assistant-muted/50"
          >
            Meet Someone New
          </Button>
        }
      />
    </div>
  );
};

export default ContactsSection;