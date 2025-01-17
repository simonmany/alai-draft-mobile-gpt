import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactsOrbit from "@/components/ContactsOrbit";

const Contacts = () => {
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
    </div>
  );
};

export default Contacts;