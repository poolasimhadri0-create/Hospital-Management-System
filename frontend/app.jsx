import { useState } from "react";
import "./styles.css";
import PortalSelection from "./components/PortalSelection.jsx";
import Navbar from "./components/navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Login from "./pages/login.jsx";
import DoctorLogin from "./pages/doctor_login.jsx";
import PatientLogin from "./pages/patient_login.jsx";
import Doctors from "./pages/doctors.jsx";
import Patients from "./pages/patient.jsx";
import Appointments from "./pages/apointment.jsx";
import DoctorApprovals from "./pages/DoctorApprovals.jsx";

const PAGES = {
  dashboard:    { label: "Dashboard",    component: Dashboard,    icon: "🏠" },
  portals:      { label: "Portals",      component: PortalSelection, icon: "🌐" },
  admin_dashboard: { label: "Admin Panel", component: AdminDashboard, icon: "🛡️" },
  admin_login:  { label: "Admin Portal",   component: Login,        icon: "🔐" },
  doctor_login: { label: "Doctor Portal",  component: DoctorLogin,  icon: "🩺" },
  patient_login:{ label: "Patient Portal", component: PatientLogin, icon: "🩹" },
  doctors:      { label: "Doctors",      component: Doctors,      icon: "👨‍⚕️" },
  patients:     { label: "Patients",     component: Patients,     icon: "🧑‍🤝‍🧑" },
  appointments: { label: "Appointments", component: Appointments, icon: "📅" },
  doctor_approvals: { label: "Doctor Approvals", component: DoctorApprovals, icon: "✅" },
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  // Get logged in user info to update topbar UI
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("medicore_admin"));
    } catch {
      return null;
    }
  })();

  const userInitials = user ? user.username.substring(0, 2).toUpperCase() : "??";

  // Safety check to prevent crashing if activePage key is missing
  const pageConfig = PAGES[activePage] || PAGES.dashboard;
  const ActivePage = pageConfig.component;

  return (
    <div className="app-shell">
      <div className="main-content">
        <Navbar 
          pageLabel={pageConfig.label} 
          pageIcon={pageConfig.icon} 
          userInitials={userInitials} 
        />

        {/* Page content */}
        <div className="page-body">
          <ActivePage onPageChange={setActivePage} />
        </div>
      </div>
    </div>
  );
}

export default App;