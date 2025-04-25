import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar';

// Import your sections (components)
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Feature';
import Pricing from './pages/Pricing';
import AuthSection from './pages/Autho';
import Footer from './pages/Footer';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        {/* Now, we are just including all sections inside Home */}
        <div id="home" className="section">
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
        <div id="auth" className="section">
          <AuthSection />
        </div>
        <Footer />
        <Dashboard />
      </Router>
    </div>
  );
}

export default App;
