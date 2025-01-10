import ContactsOrbit from "@/components/ContactsOrbit";

const Contacts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Network</h1>
      </div>
      <ContactsOrbit />
    </div>
  );
};

export default Contacts;