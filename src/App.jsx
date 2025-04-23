import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/Toast';

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
import ScheduleDetail from './pages/ScheduleDetail';

function App() {
  const { user } = useContext(AuthContext);
  
  // Add this effect to set styles that prevent layout shift
  useEffect(() => {
    // Calculate scrollbar width once
    const calculateScrollbarWidth = () => {
      // Create a div with scrollbars
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);
      
      // Create an inner div
      const inner = document.createElement('div');
      outer.appendChild(inner);
      
      // Calculate the width difference
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      
      // Clean up
      document.body.removeChild(outer);
      
      return scrollbarWidth;
    };
    
    // Add style to head to reserve scrollbar space
    const style = document.createElement('style');
    const scrollbarWidth = calculateScrollbarWidth();
    
    style.textContent = `
      :root {
        --scrollbar-width: ${scrollbarWidth}px;
      }
      
      html {
        overflow-y: scroll !important;
        width: calc(100vw - (100vw - 100%));
        scrollbar-gutter: stable !important;
      }
      
      .modal-lock {
        padding-right: var(--scrollbar-width) !important;
      }
      
      /* Prevent jumps when modal opens */
      html.modal-freeze,
      html.modal-freeze body {
        overflow: hidden !important;
        height: 100vh !important;
        width: 100vw !important;
        position: relative !important;
      }
      
      /* Completely disable scroll behavior during modal interactions */
      .modal-open * {
        scroll-behavior: auto !important;
        overflow-anchor: none !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-base-100">
          {/* Navigation */}
          <Navbar />

          {/* Toast notifications */}
          <ToastContainer />

          {/* Content - add padding-top to account for fixed navbar */}
          <div className="container mx-auto p-4 pt-20">
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
              
              {/* New route for schedule details */}
              <Route 
                path="/schedule/:scheduleId" 
                element={
                  <ProtectedRoute>
                    <ScheduleDetail />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
