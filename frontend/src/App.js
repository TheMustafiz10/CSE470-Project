
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your pages
import FriendlyHelpHome from './Pages/FriendlyHelpHome';
// import ApplynowasVolunteer from './Pages/ApplynowasVolunteer';
import Blog from './Pages/Blog';
import CorporateWellnessProgram from './Pages/CorporateWellnessProgram';
import Resources from './Pages/Resources';
import Research from './Pages/Research';
import FAQ from './Pages/FAQ';
import Donation from './Pages/Donation';
import HelplineService from './Pages/HelplineService';
import HelplineVolunteer from './Pages/HelplineVolunteer';
import NonHelplineVolunteer from './Pages/NonHelplineVolunteer';
import SpreadtheWord from './Pages/SpreadtheWord';
import MissionandVision from './Pages/MissionandVision';
import WhoWeAre from './Pages/WhoWeAre';
import Reports from './Pages/Reports';
import TrainingsandWorkshops from './Pages/TrainingsandWorkshops';
import VolunteerRegistration from './Pages/VolunteerRegistration';






// import images
// import Donations from "./Components/Assets/Donations.jpg";






function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<FriendlyHelpHome />} />
          {/* <Route path="/apply-now" element={<ApplynowasVolunteer/>} /> */}

          <Route path="/apply-now" element={<VolunteerRegistration />} />



          <Route path="/blog" element={<Blog />} />
          <Route path="/corporate-wellness" element={<CorporateWellnessProgram />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/research" element={<Research />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/donation" element={<Donation />} />

          {/* <Route path="/donation" element={<Donation image={Donations} />} /> */}

          <Route path="/helpline-service" element={<HelplineService />} />
          <Route path="/helpline-volunteer" element={<HelplineVolunteer />} />
          <Route path="/non-helpline-volunteer" element={<NonHelplineVolunteer />} />
          <Route path="/spread-the-word" element={<SpreadtheWord />} />
          <Route path="/mission-and-vision" element={<MissionandVision />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/trainings-and-workshops" element={<TrainingsandWorkshops />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

