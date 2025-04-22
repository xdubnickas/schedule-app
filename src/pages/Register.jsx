import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signUp } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Register user with our AuthContext
      const { error: signUpError } = await signUp(email, password, {
        username,
        first_name: firstName,
        last_name: lastName
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      // Registration successful
      console.log('Registration successful');
      
      // Navigate to login page
      navigate('/login', { 
        state: { 
          message: 'Registration successful!' 
        } 
      });
    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.message || 'Registration error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 mb-10">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <h2 className="card-title text-2xl font-bold mb-6 justify-center">Register</h2>
          
          {error && (
            <div className="alert alert-error shadow-lg mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-base">Email</span>
                <span className="label-text-alt text-red-500">*</span>
              </label>
              <input 
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control mt-4">
              <label className="label pb-1">
                <span className="label-text text-base">Username</span>
                <span className="label-text-alt text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="your_username"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-base">First Name</span>
                  <span className="label-text-alt text-opacity-60">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="input input-bordered w-full"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-base">Last Name</span>
                  <span className="label-text-alt text-opacity-60">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered w-full"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-control mt-4">
              <label className="label pb-1">
                <span className="label-text text-base">Password</span>
                <span className="label-text-alt text-red-500">*</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered w-full" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div className="form-control mt-4">
              <label className="label pb-1">
                <span className="label-text text-base">Confirm Password</span>
                <span className="label-text-alt text-red-500">*</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered w-full" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <p>Already have an account? <Link to="/login" className="link link-primary">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
