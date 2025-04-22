import { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../services/supabaseClient';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
    } catch (err) {
      console.error('Error sending reset email:', err);
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <h2 className="card-title text-2xl font-bold mb-6 justify-center">Forgot Password</h2>
          
          {emailSent ? (
            <div className="text-center">
              <div className="alert alert-success shadow-lg mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Password reset email sent!</span>
                </div>
              </div>
              
              <p className="mb-6 text-lg">
                Please check your email for a link to reset your password.
                If it doesn't appear within a few minutes, check your spam folder.
              </p>
              
              <Link to="/login" className="btn btn-primary">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6">
                Enter your email address below. We will send you an email with instructions to reset your password.
              </p>
              
              {error && (
                <div className="alert alert-error shadow-lg mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base">Email</span>
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
                
                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="link link-primary">
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
