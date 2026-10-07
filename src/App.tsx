import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AgentePage from './pages/AgentePage';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';
import PublicEventPage from './pages/PublicEventPage';

function AppShell() {
  const location = useLocation();
  const isPublicEvent = location.pathname.startsWith('/e/');

  return (
    <div className="min-h-screen bg-cream font-body text-charcoal">
      {!isPublicEvent && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agente" element={<AgentePage />} />
        <Route path="/criar-evento" element={<CreateEventPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/:id" element={<DashboardPage />} />
        <Route path="/eventos/:id/convidados" element={<GuestsPage />} />
        <Route path="/eventos/:id/presentes" element={<GiftListPage />} />
        <Route path="/eventos/:id/personalizar" element={<PersonalizationPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/profissional/:id" element={<ProfessionalProfilePage />} />
        <Route path="/e/:slug" element={<PublicEventPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isPublicEvent && <Footer />}
      {!isPublicEvent && <AIAssistant />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;