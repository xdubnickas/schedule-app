import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import supabase from '../services/supabaseClient';

function Dashboard() {
  const { user, profile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_public: false
  });
  
  // If not logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user's schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching schedules:', error);
          } else {
            setSchedules(data || []);
          }
        } catch (err) {
          console.error('Failed to fetch schedules:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchedules();
  }, [user]);

  // Replace the existing modal effect with a simpler approach
  useEffect(() => {
    if (modalOpen) {
      // Just prevent scrolling without changing padding
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [modalOpen]);

  const openCreateModal = () => {
    setCurrentSchedule(null);
    setFormData({
      title: '',
      description: '',
      is_public: false
    });
    setModalOpen(true);
  };

  const openEditModal = (schedule) => {
    setCurrentSchedule(schedule);
    setFormData({
      title: schedule.title,
      description: schedule.description || '',
      is_public: schedule.is_public
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentSchedule) {
        // Update existing schedule
        const { error } = await supabase
          .from('schedules')
          .update({
            title: formData.title,
            description: formData.description,
            is_public: formData.is_public
          })
          .eq('id', currentSchedule.id);
          
        if (error) throw error;
        
        // Update local state
        setSchedules(schedules.map(s => 
          s.id === currentSchedule.id ? {...s, ...formData} : s
        ));
      } else {
        // Create new schedule
        const { data, error } = await supabase
          .from('schedules')
          .insert([
            {
              user_id: user.id,
              title: formData.title,
              description: formData.description,
              is_public: formData.is_public
            }
          ])
          .select();
          
        if (error) throw error;
        
        // Add to local state
        setSchedules([...schedules, ...data]);
      }
      
      // Close modal
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert('Failed to save schedule. Please try again.');
    }
  };

  if (!user) return null; // Don't render anything while redirecting
  
  return (
    <div className="py-8">
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h1 className="text-3xl font-bold card-title">
            Welcome to your Dashboard, {profile?.username || 'User'}!
          </h1>
          
          <p className="mt-4 text-lg">
            This is your personal dashboard. More features will be added soon.
          </p>
          
          <div className="mt-8 stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <div className="stat-title">Account</div>
              <div className="stat-value">{user.email}</div>
              <div className="stat-desc">Your registered email</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold card-title">Your Schedules</h2>
            <button 
              className="btn btn-primary" 
              onClick={openCreateModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Schedule
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : schedules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className={"card bg-base-200 shadow-sm hover:shadow-md transition-shadow"}>
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <h3 className="card-title text-lg">{schedule.title}</h3>
                      <div className="tooltip" data-tip={schedule.is_public ? "Public schedule" : "Private schedule"}>
                        {schedule.is_public ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{color: '#7472FF'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{color: '#8a93a1'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-base-content/80 mt-1 mb-2">{schedule.description || 'No description'}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs opacity-70">
                        {new Date(schedule.created_at).toLocaleDateString()}
                      </div>
                      <div className="join">
                        <button 
                          className="btn btn-sm join-item btn-soft btn-edittt tooltip" 
                          data-tip="Edit"
                          onClick={() => openEditModal(schedule)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="btn btn-sm join-item btn-primary tooltip" data-tip="View">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold mb-2">No schedules yet</h3>
              <p className="text-gray-500">Create your first schedule to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Schedule */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-lg mx-auto relative">
            <button 
              onClick={() => setModalOpen(false)} 
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg pr-6">
              {currentSchedule ? 'Edit Schedule' : 'Create New Schedule'}
            </h3>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Schedule Title"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Schedule Description (optional)"
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Visibility</span>
                </label>
                <div className="flex bg-base-300 rounded-lg p-1 relative">
                  {/* Sliding highlight effect */}
                  <div 
                    className="absolute top-1 bottom-1 w-[49.1%] bg-base-100 rounded-md shadow-md transition-all duration-300 ease-in-out" 
                    style={{ 
                      transform: formData.is_public ? 'translateX(100%)' : 'translateX(0)' 
                    }}
                  ></div>
                  
                  <label className="w-1/2 z-10">
                    <input 
                      type="radio" 
                      name="visibility" 
                      className="hidden peer" 
                      checked={!formData.is_public}
                      onChange={() => setFormData({...formData, is_public: false})}
                    />
                    <div className="flex items-center justify-center gap-2 p-2 cursor-pointer rounded-md transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 transition-transform duration-300 ${!formData.is_public ? 'scale-110' : 'scale-90'}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className={`text-sm font-medium transition-all duration-300 ${!formData.is_public ? 'font-bold' : 'opacity-70'}`}>
                        Private
                      </span>
                    </div>
                  </label>
                  
                  <label className="w-1/2 z-10">
                    <input 
                      type="radio" 
                      name="visibility" 
                      className="hidden peer" 
                      checked={formData.is_public}
                      onChange={() => setFormData({...formData, is_public: true})}
                    />
                    <div className="flex items-center justify-center gap-2 p-2 cursor-pointer rounded-md transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 text-[#7472FF] transition-transform duration-300 ${formData.is_public ? 'scale-110' : 'scale-90'}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className={`text-sm font-medium transition-all duration-300 ${formData.is_public ? 'font-bold' : 'opacity-70'}`}>
                        Public
                      </span>
                    </div>
                  </label>
                </div>
                <div className="text-xs text-gray-500 italic mt-1 transition-opacity duration-300">
                  {formData.is_public 
                    ? "Your schedule will be visible to others and can be shared." 
                    : "Your schedule will only be visible to you."}
                </div>
              </div>
              
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentSchedule ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
          <div 
            className="modal-backdrop" 
            onClick={() => setModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
