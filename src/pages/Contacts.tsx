import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactsOrbit from "@/components/ContactsOrbit";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Contacts = () => {
  const navigate = useNavigate();

  // Sample groups data - in a real app, this would come from a database
  const groups = [
    {
      name: "Inner Orbit",
      contacts: [
        { id: 7, name: "Sarah Johnson", status: "Close Friend" },
        { id: 8, name: "Mike Peters", status: "Family" },
      ]
    },
    {
      name: "College Friends",
      contacts: [
        { id: 9, name: "Emma Wilson", status: "Roommate" },
        { id: 10, name: "James Brown", status: "Study Group" },
      ]
    },
    {
      name: "Work Friends",
      contacts: [
        { id: 11, name: "Lisa Chen", status: "Team Lead" },
        { id: 12, name: "Alex Kim", status: "Department" },
      ]
    },
    {
      name: "Golf Friends",
      contacts: [
        { id: 13, name: "Tom Wilson", status: "Club Member" },
        { id: 14, name: "David Park", status: "Weekly Game" },
      ]
    }
  ];

  const handleContactClick = (contact: { id: number; name: string; status: string }) => {
    navigate(`/contacts/${contact.id}`, { 
      state: { 
        id: contact.id,
        name: contact.name,
        status: contact.status
      } 
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Social Circle</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactsOrbit />
        </CardContent>
      </Card>

      {groups.map((group) => (
        <Card key={group.name}>
          <CardHeader>
            <CardTitle className="text-lg">{group.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.contacts.map((contact) => (
                  <TableRow 
                    key={contact.name}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleContactClick(contact)}
                  >
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-assistant-muted">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Contacts;