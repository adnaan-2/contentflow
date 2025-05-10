import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingNavbar from './components/LandingNavbar';
import DashboardNavbar from './components/DashboardNavbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import your landing page components
import Home from '../src/landingpages/Home';
import About from '../src/landingpages/About';
import Features from '../src/landingpages/Feature';  
import Pricing from '../src/landingpages/Pricing';
import Footer from '../src/landingpages/Footer';   
import Login from '../src/landingpages/Login';
import Signup from '../src/landingpages/Signup';

// Import your dashboard pages
import Dashboard from './dashboardpages/Dashboard';
import SocialAccounts from './dashboardpages/SocialAccounts';
import Content from './dashboardpages/Content';
import Analytics from './dashboardpages/Analytics';
import Messages from './dashboardpages/Messages';
import Reports from './dashboardpages/Reports';
import Settings from './dashboardpages/Settings';

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div>
      {isDashboardRoute ? <DashboardNavbar /> : <LandingNavbar />}
      <div className={isDashboardRoute ? 'dashboard-content' : ''}>
        <Routes>
          {/* Landing page routes */}
          <Route path="/" element={
            <div className="landing-container">
              <div id="/" className="section">
                <Home />
              </div>
              <div id="about" className="section">
                <About />
              </div>
              <div id="features" className="section">
                <Features />
              </div>
              <div id="pricing" className="section">
                <Pricing />
              </div>
              <Footer />
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard routes - all use the dashboard-content class */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardNavbar />
              <div className="dashboard-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/social-accounts" element={<SocialAccounts />} />
                  <Route path="/content" element={<Content />} />
                  {/* Other dashboard routes */}
                </Routes>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
