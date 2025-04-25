import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/Toast';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ScheduleDetail from './pages/ScheduleDetail';
import SharedSchedule from './pages/SharedSchedule';

function App() {
  const { user } = useContext(AuthContext);
  
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
              
              {/* Schedule routes */}
              <Route 
                path="/schedule/:scheduleId" 
                element={
                  <ProtectedRoute>
                    <ScheduleDetail />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public schedule share route - no authentication required */}
              <Route 
                path="/schedule/share/:scheduleId" 
                element={<SharedSchedule />} 
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
