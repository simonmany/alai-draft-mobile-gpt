import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactsOrbit from "@/components/ContactsOrbit";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Contacts = () => {
  // Sample groups data - in a real app, this would come from a database
  const groups = [
    {
      name: "Inner Orbit",
      contacts: [
        { name: "Sarah Johnson", status: "Close Friend" },
        { name: "Mike Peters", status: "Family" },
      ]
    },
    {
      name: "College Friends",
      contacts: [
        { name: "Emma Wilson", status: "Roommate" },
        { name: "James Brown", status: "Study Group" },
      ]
    },
    {
      name: "Work Friends",
      contacts: [
        { name: "Lisa Chen", status: "Team Lead" },
        { name: "Alex Kim", status: "Department" },
      ]
    },
    {
      name: "Golf Friends",
      contacts: [
        { name: "Tom Wilson", status: "Club Member" },
        { name: "David Park", status: "Weekly Game" },
      ]
    }
  ];

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
                  <TableRow key={contact.name}>
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