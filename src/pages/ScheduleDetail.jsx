import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import supabase from '../services/supabaseClient';
import ScheduleViewer from '../components/ScheduleViewer';
import EntryModal from '../components/EntryModal';

function ScheduleDetail() {
  const { scheduleId } = useParams();
  const { user } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState(null);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_entries')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      showError('Failed to load schedule entries');
    }
  };

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select('*')
          .eq('id', scheduleId)
          .single();

        if (scheduleError) throw scheduleError;

        if (!scheduleData.is_public && scheduleData.user_id !== user.id) {
          throw new Error('You do not have permission to view this schedule');
        }

        setSchedule(scheduleData);
        await fetchEntries();
      } catch (error) {
        console.error('Error fetching schedule details:', error);
        setError(error.message || 'Failed to load schedule');
        showError(error.message || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId && user) {
      fetchScheduleDetails();
    }
  }, [scheduleId, user]);

  const handleAddEntry = async (newEntry) => {
    try {
      const entryToAdd = {
        title: newEntry.title,
        day_of_week: newEntry.day_of_week,
        start_time: newEntry.start_time,
        end_time: newEntry.end_time,
        note: newEntry.note || '',
        schedule_id: scheduleId
      };

      const { data, error } = await supabase
        .from('schedule_entries')
        .insert(entryToAdd)
        .select()
        .single();

      if (error) throw error;

      await fetchEntries();
      showSuccess('Entry added successfully');
      return data;
    } catch (error) {
      console.error('Error adding entry:', error);
      showError('Failed to add entry. Please try again.');
      throw error;
    }
  };

  const handleEditEntry = async (updatedEntry) => {
    try {
      const { data, error } = await supabase
        .from('schedule_entries')
        .update({
          title: updatedEntry.title,
          day_of_week: updatedEntry.day_of_week,
          start_time: updatedEntry.start_time,
          end_time: updatedEntry.end_time,
          note: updatedEntry.note || ''
        })
        .eq('id', updatedEntry.id)
        .select();

      if (error) throw error;

      await fetchEntries();
      showSuccess('Entry updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating entry:', error);
      showError('Failed to update entry. Please try again.');
      throw error;
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const { error } = await supabase
        .from('schedule_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      await fetchEntries();
      showSuccess('Entry deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      showError('Failed to delete entry. Please try again.');
      throw error;
    }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddButtonClick = (dayIndex = 0, hour = 8) => {
    const formatTimeString = (h) => {
      const formattedHour = h.toString().padStart(2, '0');
      return `${formattedHour}:00:00`;
    };
    
    const newEntryTemplate = {
      day_of_week: dayIndex + 1,
      start_time: formatTimeString(hour),
      end_time: formatTimeString(hour + 1),
      title: '',
      note: '',
      schedule_id: scheduleId
    };

    setActiveEntry(newEntryTemplate);
    setIsAddModalOpen(true);
  };

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
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Back to Dashboard
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
          <p>The schedule you're looking for doesn't exist or you don't have permission to view it.</p>
          <div className="card-actions justify-end mt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user.id === schedule.user_id;

  const copyShareableLink = () => {
    const shareUrl = `${window.location.origin}/schedule/share/${scheduleId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => showSuccess('Link copied to clipboard!'))
      .catch(() => showError('Failed to copy link'));
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{schedule.title}</h1>
          {schedule.description && (
            <p className="mt-2 text-base-content/70">{schedule.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>

          {isOwner && schedule.is_public && (
            <button
              className="btn btn-secondary"
              onClick={copyShareableLink}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Copy Shareable Link
            </button>
          )}

          {isOwner && (
            <button
              className="btn btn-primary"
              onClick={() => handleAddButtonClick()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Entry
            </button>
          )}
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <div className={`badge ${schedule.is_public ? 'badge-primary' : 'badge-neutral'}`}>
              {schedule.is_public ? 'Public' : 'Private'}
            </div>
            <div className="text-sm text-base-content/70">
              Created on {new Date(schedule.created_at).toLocaleDateString()}
            </div>
          </div>

          <ScheduleViewer
            entries={entries}
            title={schedule.title}
            showWeekend={true}
            isEditable={isOwner}
            onAddEntry={handleAddEntry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onAddButtonClick={handleAddButtonClick}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <EntryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          activeEntry={activeEntry}
          setActiveEntry={setActiveEntry}
          modalMode="add"
          setModalMode={() => {}}
          onSave={async () => {
            try {
              await handleAddEntry(activeEntry);
              setIsAddModalOpen(false);
            } catch (error) {
              console.error("Error adding entry:", error);
            }
          }}
          onDelete={() => {}}
          isEditable={true}
          days={days}
        />
      )}
    </div>
  );
}

export default ScheduleDetail;
