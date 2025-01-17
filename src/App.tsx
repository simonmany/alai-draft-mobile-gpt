import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Calendar from "@/pages/Calendar";
import Contacts from "@/pages/Contacts";
import ContactDetails from "@/pages/ContactDetails";
import Goals from "@/pages/Goals";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactDetails />} />
          <Route path="goals" element={<Goals />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;