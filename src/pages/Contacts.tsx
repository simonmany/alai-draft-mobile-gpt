import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contacts = () => {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your contacts will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;