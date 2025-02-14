import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './contexts/UserContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import BrowseOpportunities from './pages/BrowseOpportunities';
import OpportunityDetails from './pages/OpportunityDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AboutUs from './pages/AboutUs';
import CreateOpportunity from './pages/CreateOpportunity';
import PrivateRoute from './components/PrivateRoute';
import OrganizationDashboard from './pages/OrganizationDashboard';
import './styles/components.css';

// Create a wrapper component for AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseOpportunities />} />
        <Route path="/opportunity/:id" element={<OpportunityDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route 
          path="/opportunities/create" 
          element={
            <PrivateRoute>
              <CreateOpportunity />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              {user => user.is_organization ? <OrganizationDashboard /> : <VolunteerDashboard />}
            </PrivateRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setGradientPosition(scrollPosition * 0.2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const gradientStyle = {
    backgroundPosition: `${gradientPosition}% 50%`,
  };

  return (
    <GoogleOAuthProvider clientId="1032409090840-gus43isikcnuq4n365l7gocm53h725dl.apps.googleusercontent.com">
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <NavBar isScrolled={isScrolled} gradientStyle={gradientStyle} />
            <main className="pt-16">
              <AnimatedRoutes />
            </main>
          </div>
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
