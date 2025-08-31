

// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";
// import UpdateVolunteer from "./pages/UpdateVolunteer";
// import { VolunteerProvider } from "./context/VolunteerContext";

// export default function App() {
//   return (
//     <VolunteerProvider>
//       <Router>
//         <Routes>
//           {/* Default route redirects to admin dashboard */}
//           <Route path="/" element={<Navigate to="/admin" replace />} />

//           {/* Admin Dashboard */}
//           <Route path="/admin" element={<AdminDashboard />} />

//           {/* Update Volunteer Page */}
//           <Route path="/update-volunteer/:id" element={<UpdateVolunteer />} />

//           {/* Catch-all route */}
//           <Route path="*" element={<h2>404: Page Not Found</h2>} />
//         </Routes>
//       </Router>
//     </VolunteerProvider>
//   );
// }










import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateVolunteer from "./pages/UpdateVolunteer";
import { VolunteerProvider } from "./context/VolunteerContext";

export default function App() {
  return (
    <VolunteerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/update-volunteer/:id" element={<UpdateVolunteer />} />
          <Route path="*" element={<h2>404: Page Not Found</h2>} />
        </Routes>
      </Router>
    </VolunteerProvider>
  );
}
