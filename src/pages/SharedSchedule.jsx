import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import supabase from '../services/supabaseClient';
import ScheduleViewer from '../components/ScheduleViewer';
import '../styles/sharedschedule.css';

function SharedSchedule() {
  const { scheduleId } = useParams();
  const { showError } = useToast();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [owner, setOwner] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        // Fetch schedule data
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select('*')
          .eq('id', scheduleId)
          .single();

        if (scheduleError) throw scheduleError;

        // Check if the schedule is public
        if (!scheduleData.is_public) {
          throw new Error('This schedule is private and cannot be viewed');
        }

        setSchedule(scheduleData);
        
        // Fetch owner profile information
        const { data: ownerData, error: ownerError } = await supabase
          .from('profiles')
          .select('username, first_name, last_name')
          .eq('id', scheduleData.user_id)
          .single();
          
        if (ownerError) {
          console.error('Error fetching owner details:', ownerError);
        } else {
          setOwner(ownerData);
        }
        
        // Fetch entries for this schedule
        const { data: entriesData, error: entriesError } = await supabase
          .from('schedule_entries')
          .select('*')
          .eq('schedule_id', scheduleId)
          .order('day_of_week', { ascending: true })
          .order('start_time', { ascending: true });

        if (entriesError) throw entriesError;
        setEntries(entriesData || []);
      } catch (error) {
        console.error('Error fetching schedule details:', error);
        setError(error.message || 'Failed to load schedule');
        showError(error.message || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchScheduleDetails();
    }
  }, [scheduleId, showError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-error">Error</h2>
          <p>{error}</p>
          <div className="card-actions justify-end mt-4">
            <button
              onClick={() => navigate('/')}
              className="action-button"
            >
              Go Home
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Schedule Not Found</h2>
          <p>The schedule you're looking for doesn't exist or is private.</p>
          <div className="card-actions justify-end mt-4">
            <button
              onClick={() => navigate('/')}
              className="action-button"
            >
              Go Home
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get formatted date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="py-6 shared-schedule-container">
      <div className="shared-schedule-header">
        <h1 className="shared-title">{schedule.title}</h1>
        
        <div className="shared-header-content">
          <div className="shared-header-left">
            {schedule.description && (
              <p className="shared-description">{schedule.description}</p>
            )}
            
            <div className="owner-info">
              <div className="owner-avatar">
                {owner?.username ? owner.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="owner-details">
                <span className="shared-by-label">Shared by</span>
                <span className="owner-name">{owner?.username || 'Unknown user'}</span>
                {owner?.first_name && owner?.last_name && (
                  <span className="owner-fullname">{owner.first_name} {owner.last_name}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="shared-header-right">
            <div className="schedule-metadata">
              <div className="schedule-badge">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Public Schedule
              </div>
              
              <div className="created-date">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created on {formatDate(schedule.created_at)}
              </div>
            </div>
            
            <button
              className="action-button"
              onClick={() => navigate('/')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </button>
          </div>
        </div>
      </div>

      <div className="shared-card">
        <div className="card-body">
          <ScheduleViewer
            entries={entries}
            title={schedule.title}
            showWeekend={true}
            isEditable={false}
          />
        </div>
      </div>
    </div>
  );
}

export default SharedSchedule;
