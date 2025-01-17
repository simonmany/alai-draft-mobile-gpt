import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Contact {
  id: number;
  name: string;
  imageUrl?: string;
}

const ContactsOrbit = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Sample contacts data - in a real app, this would come from a database
  const contacts: Contact[] = [
    { id: 1, name: "Sarah Johnson" },
    { id: 2, name: "Mike Peters" },
    { id: 3, name: "Emma Wilson" },
    { id: 4, name: "James Brown" },
    { id: 5, name: "Lisa Chen" },
    { id: 6, name: "Alex Kim" },
  ];

  // Adjust radius based on screen size
  const getRadius = () => {
    if (isMobile) return 120;
    return 180;
  };

  const handleContactClick = (contact: Contact) => {
    navigate(`/contacts/${contact.id}`, { 
      state: { 
        id: contact.id,
        name: contact.name,
        imageUrl: contact.imageUrl
      } 
    });
  };

  return (
    <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center bg-assistant-background rounded-lg p-4 md:p-8">
      {/* Center user avatar */}
      <div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <Avatar className="h-16 w-16 md:h-24 md:w-24 border-4 border-assistant-primary shadow-lg">
          <AvatarFallback className="bg-assistant-muted">
            <User className="h-8 w-8 md:h-12 md:w-12 text-assistant-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="mt-2 text-center font-medium text-gray-900">You</div>
      </div>

      {/* Orbiting contacts */}
      {contacts.map((contact, index) => {
        const angle = (index * (360 / contacts.length)) * (Math.PI / 180);
        const radius = getRadius();
        const duration = 20 + index * 5;
        
        const orbitStyle = {
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          marginLeft: `-${radius}px`,
          marginTop: `-${radius}px`,
          animation: `spin ${duration}s linear infinite`,
        } as React.CSSProperties;

        const contactStyle = {
          position: 'absolute',
          left: `${radius + Math.cos(angle) * radius}px`,
          top: `${radius + Math.sin(angle) * radius}px`,
          transform: 'translate(-50%, -50%)',
        } as React.CSSProperties;

        return (
          <div key={contact.id} className="absolute" style={orbitStyle}>
            <div 
              style={contactStyle} 
              className="transition-transform hover:scale-110 cursor-pointer"
              onClick={() => handleContactClick(contact)}
            >
              <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-assistant-secondary shadow-md">
                <AvatarFallback className="bg-assistant-muted text-sm">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 text-xs md:text-sm text-center font-medium text-gray-700">
                {contact.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactsOrbit;