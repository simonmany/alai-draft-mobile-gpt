import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Calendar from "@/pages/Calendar";
import Activities from "@/pages/Activities";
import Contacts from "@/pages/Contacts";
import ContactDetails from "@/pages/ContactDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="activities" element={<Activities />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;