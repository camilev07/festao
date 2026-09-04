import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import LandingPage from './pages/LandingPage';
import CreateEventPage from './pages/CreateEventPage';
import DashboardPage from './pages/DashboardPage';
import GuestsPage from './pages/GuestsPage';
import GiftListPage from './pages/GiftListPage';
import PersonalizationPage from './pages/PersonalizationPage';
import ServicesPage from './pages/ServicesPage';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream font-body text-charcoal">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/criar-evento" element={<CreateEventPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/:id" element={<DashboardPage />} />
          <Route path="/eventos/:id/convidados" element={<GuestsPage />} />
          <Route path="/eventos/:id/presentes" element={<GiftListPage />} />
          <Route path="/eventos/:id/personalizar" element={<PersonalizationPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/profissional/:id" element={<ProfessionalProfilePage />} />
        </Routes>
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;