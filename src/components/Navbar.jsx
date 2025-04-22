import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Error logging out:', error);
        return;
      }
      navigate('/');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-md px-4 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          {/* Wider dropdown with better spacing */}
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-base-100 rounded-box w-64 gap-2">
            <li>
              <Link 
                to={user ? "/dashboard" : "/"} 
                className={
                  (location.pathname === '/' && !user) || 
                  (location.pathname === '/dashboard' && user) 
                    ? 'active font-medium text-base' 
                    : 'text-base'
                }
              >
                Home
              </Link>
            </li>
          </ul>
        </div>
        <Link to={user ? "/dashboard" : "/"} className="btn btn-ghost text-xl font-bold">
          <span className="text-primary">Schedule</span>Share
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-base">
          <li>
            <Link 
              to={user ? "/dashboard" : "/"} 
              className={`px-4 hover:text-primary ${
                (location.pathname === '/' && !user) || 
                (location.pathname === '/dashboard' && user) 
                  ? 'text-primary font-medium' 
                  : ''
              }`}
            >
              Home
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end space-x-2">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block font-medium">
              {profile?.username}
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-ghost text-red-500 hover:bg-base-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Log Out
            </button>
          </div>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`btn btn-ghost hover:bg-base-300 ${location.pathname === '/login' ? 'border-b-2 border-primary' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="btn btn-primary hover:btn-primary-focus"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
