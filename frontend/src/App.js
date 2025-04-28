import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';

// Import your sections (components)
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Feature';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './pages/Footer';
import Dashboard from './pages/Dashboard';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if user is authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Main landing page route */}
          <Route path="/" element={
            <>
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
              <Footer />
            </>
          } />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
