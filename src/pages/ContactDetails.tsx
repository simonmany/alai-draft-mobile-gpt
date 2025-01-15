import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ArrowLeft,
  MessageCircle,
  Star,
  Clock
} from "lucide-react";

interface ContactDetailsProps {
  id: number;
  name: string;
  imageUrl?: string;
}

const ContactDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const contact = location.state as ContactDetailsProps;

  if (!contact) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate('/contacts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <p className="text-center mt-8">Contact not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/contacts')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Contacts
      </Button>

      {/* Contact Header */}
      <div className="flex items-center space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-assistant-muted text-xl">
            {contact.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
          <p className="text-gray-500">Last contacted 3 days ago</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button className="w-full" variant="outline">
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Button>
        <Button className="w-full" variant="outline">
          <MessageCircle className="mr-2 h-4 w-4" />
          Message
        </Button>
        <Button className="w-full" variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span>(555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span>contact@example.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span>123 Main St, City, State</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span>Birthday: January 1</span>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium">Phone call - 3 days ago</p>
              <p className="text-gray-500">Duration: 15 minutes</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MessageCircle className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium">Message sent - 1 week ago</p>
              <p className="text-gray-500">Discussed upcoming meeting</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Notes</h2>
          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
        <p className="text-gray-500 italic">No notes yet</p>
      </Card>
    </div>
  );
};

export default ContactDetails;