import React from 'react';
import ContactsOrbit from "@/components/ContactsOrbit";
import { Card } from "@/components/ui/card";
import { Users, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: number;
  name: string;
  imageUrl?: string;
}

interface ContactGroup {
  id: string;
  name: string;
  count: number;
  color: string;
  members: Contact[];
}

const Contacts = () => {
  const navigate = useNavigate();
  
  const handleContactClick = (contact: Contact) => {
    navigate(`/contacts/${contact.id}`, { state: contact });
  };

  const contactGroups: ContactGroup[] = [
    { 
      id: "inner", 
      name: "Inner Orbit", 
      count: 5, 
      color: "#9b87f5",
      members: [
        { id: 1, name: "Sarah Johnson", imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
        { id: 2, name: "Mike Peters", imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952" },
        { id: 3, name: "Emma Wilson", imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
        { id: 4, name: "James Brown" },
        { id: 5, name: "Lisa Chen" },
      ]
    },
    { 
      id: "college", 
      name: "College Friends", 
      count: 8, 
      color: "#7E69AB",
      members: [
        { id: 6, name: "Alex Kim" },
        { id: 7, name: "David Wang" },
        { id: 8, name: "Rachel Green" },
        { id: 9, name: "Tom Anderson" },
        { id: 10, name: "Maria Garcia" },
        { id: 11, name: "Chris Lee" },
        { id: 12, name: "Sophie Turner" },
        { id: 13, name: "Kevin Patel" },
      ]
    },
    { 
      id: "work", 
      name: "Work Friends", 
      count: 12, 
      color: "#6E59A5",
      members: [
        { id: 14, name: "John Smith" },
        { id: 15, name: "Emily Davis" },
        { id: 16, name: "Michael Johnson" },
        { id: 17, name: "Jessica White" },
        { id: 18, name: "Daniel Brown" },
        { id: 19, name: "Amanda Wilson" },
        { id: 20, name: "Robert Taylor" },
        { id: 21, name: "Jennifer Lee" },
        { id: 22, name: "William Chen" },
        { id: 23, name: "Elizabeth Kim" },
        { id: 24, name: "Richard Park" },
        { id: 25, name: "Michelle Wong" },
      ]
    },
    { 
      id: "golf", 
      name: "Golf Friends", 
      count: 6, 
      color: "#D6BCFA",
      members: [
        { id: 26, name: "Jack Palmer" },
        { id: 27, name: "Steve Woods" },
        { id: 28, name: "Phil Mitchell" },
        { id: 29, name: "Rory McPherson" },
        { id: 30, name: "Jordan Spieth" },
        { id: 31, name: "Dustin Thompson" },
      ]
    },
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
            <DropdownMenu key={group.id}>
              <DropdownMenuTrigger className="w-full">
                <Card 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow w-full"
                  style={{ borderColor: group.color }}
                >
                  <div className="flex items-center justify-between">
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
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Card>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[250px] bg-white">
                <div className="py-2">
                  {group.members.map((member) => (
                    <div 
                      key={member.id} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                      onClick={() => handleContactClick(member)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-assistant-muted text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contacts;