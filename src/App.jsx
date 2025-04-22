import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useContext(AuthContext);
  
  // Add this effect to set styles that prevent layout shift
  useEffect(() => {
    // Add style to head to reserve scrollbar space
    const style = document.createElement('style');
    style.textContent = `
      html {
        overflow-y: scroll !important;
        width: calc(100vw - (100vw - 100%));
      }
      .overflow-hidden {
        height: 100vh;
        overflow-y: hidden;
      }
      .modal-open {
        padding-right: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen bg-base-100">
        {/* Navigation */}
        <Navbar />

        {/* Content */}
        <div className="container mx-auto p-4">
          <Routes>
            {/* Public route that redirects to dashboard if logged in */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <Home />} 
            />
            
            {/* Auth routes - redirect to dashboard if already logged in */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
            />
            <Route 
              path="/forgot-password" 
              element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
