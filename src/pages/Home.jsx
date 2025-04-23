import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ScheduleViewer from '../components/ScheduleViewer';

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  // Sample entries for demonstration
  const mockEntries = [
    { id: 1, title: 'Mathematics', day_of_week: 0, start: 8, end: 10, color: 'blue' },
    { id: 2, title: 'Physics', day_of_week: 2, start: 10, end: 11, color: 'green' },
    { id: 3, title: 'Programming', day_of_week: 1, start: 9, end: 12, color: 'purple' },
    { id: 4, title: 'English', day_of_week: 4, start: 13, end: 15, color: 'orange' },
    { id: 5, title: 'Computer Science', day_of_week: 3, start: 11, end: 13, color: 'pink' },
    { id: 6, title: 'Evening Webinar', day_of_week: 2, start: 18, end: 20, color: 'blue' },
    { id: 7, title: 'Weekend Workshop', day_of_week: 5, start: 10, end: 14, color: 'purple' },
    { id: 8, title: 'Study Group', day_of_week: 6, start: 15, end: 17, color: 'green' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section with Enhanced Animations */}
      <div className="hero min-h-[50vh] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl relative overflow-hidden">
        <div className="hero-overlay bg-opacity-20 absolute inset-0 z-0">
          {/* Enhanced abstract patterns with animations */}
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
          
          {/* Additional animated elements */}
          <div className="absolute top-40 left-20 w-32 h-32 rounded-full bg-accent/5 blur-2xl animate-bounce" style={{animationDuration: '7s'}}></div>
          <div className="absolute bottom-40 right-40 w-48 h-48 rounded-full bg-secondary/5 blur-xl animate-ping" style={{animationDuration: '8s', opacity: 0.4}}></div>
          
          {/* Decorative particles */}
          <div className="particles absolute inset-0">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index}
                className="particle absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                  animation: `float-particle ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <div className="flex justify-center mb-4">
              <img 
                src="/share.png" 
                alt="Schedule Share Logo" 
                className={`w-24 h-24 drop-shadow-xl transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100 animate-float' : 'scale-90 opacity-0'}`}
              />
            </div>
            <h1 
              className={`text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              Schedule Share
            </h1>
            <p 
              className={`text-xl mb-2 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              Create & Share Your Schedule Effortlessly
            </p>
            <p 
              className={`py-4 text-lg opacity-80 max-w-xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-80' : 'translate-y-4 opacity-0'}`}
            >
              A modern solution for organizing your time. Perfect for students, teams, or personal planning.
              Create once, share anywhere, access anytime.
            </p>
            <div 
              className={`flex gap-4 justify-center mt-6 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <Link to="/register" className="btn btn-primary btn-lg hover:scale-105 transition-transform">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="text-3xl mb-2">🚀</div>
            <h2 className="card-title">Easy to Use</h2>
            <p>Intuitive interface for quick schedule creation and management.</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="text-3xl mb-2">🔗</div>
            <h2 className="card-title">Shareable Links</h2>
            <p>Share your schedule with anyone via a simple link.</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="text-3xl mb-2">✨</div>
            <h2 className="card-title">More Features Soon</h2>
            <p>We're working on advanced features to make your scheduling experience even better!</p>
          </div>
        </div>
      </div>

      {/* Demo Schedule Section with animation */}
      <div id="demo-schedule" className="rounded-xl overflow-hidden bg-base-200 p-6 shadow-lg border border-primary/20">
        <div className="mb-6">
          <div className="inline-block rounded-full bg-primary/20 px-4 py-1 text-primary font-semibold mb-2">
            👀 Live Demo
          </div>
          <h2 className="text-3xl font-bold">Experience Schedule Share in Action</h2>
          <p className="text-lg opacity-80 mt-2">
            This demo schedule showcases a typical university student weekly plan.
            Try it out to see how it works!
          </p>
        </div>
        
        {/* Use the ScheduleViewer component with a reveal animation */}
        <div className="reveal-animation">
          <ScheduleViewer 
            entries={mockEntries}
            title="University Student Schedule"
            showWeekend={true}
          />
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl p-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-xl mx-auto">Create your first schedule in minutes and experience the power of Schedule Share.</p>
        <Link to="/register" className="btn btn-lg glass">Sign Up Free</Link>
      </div>

      {/* Add the CSS animation definition */}
      <style jsx>{`
        @keyframes float {
          0% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.6;
          }
          100% { 
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(10px); }
          50% { transform: translateY(0px) translateX(20px); }
          75% { transform: translateY(10px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        
        .particle {
          animation: float-particle 10s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
