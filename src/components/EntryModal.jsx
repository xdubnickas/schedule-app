import React, { useState, useEffect } from 'react';

function EntryModal({
  isOpen,
  onClose,
  activeEntry,
  setActiveEntry,
  modalMode,
  setModalMode,
  onSave,
  onDelete,
  isEditable,
  days
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Simple modal management - just add/remove a class on the body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !activeEntry) return null;

  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return '08:00';
    const timeParts = timeStr.split(':');
    return `${timeParts[0].padStart(2, '0')}:${timeParts[1]?.padStart(2, '0') || '00'}`;
  };

  const getTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = getTimeOptions();

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const getDayIndex = () => {
    if (activeEntry.day_of_week) {
      return activeEntry.day_of_week - 1;
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop that doesn't make the screen completely black */}
      <div 
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Modal content with proper styling to ensure visibility */}
      <div className="relative z-50 bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          {showDeleteConfirmation ? (
            // Delete confirmation UI
            <>
              <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
              <p>Are you sure you want to delete this entry?</p>
              <p className="font-medium mt-2">{activeEntry.title}</p>
              <div className="modal-action mt-6">
                <button className="btn btn-outline" onClick={cancelDelete}>Cancel</button>
                <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
              </div>
            </>
          ) : (
            // Regular modal UI
            <>
              <h3 className="font-bold text-lg mb-4">
                {modalMode === 'view' ? activeEntry.title : 
                modalMode === 'edit' ? 'Edit Entry' : 'Add New Entry'}
              </h3>
              
              {modalMode === 'view' ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-24 font-semibold">Day:</div>
                    <div>{days[getDayIndex()]}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 font-semibold">Time:</div>
                    <div>{formatTimeForInput(activeEntry.start_time)} - {formatTimeForInput(activeEntry.end_time)}</div>
                  </div>
                  {activeEntry.note && (
                    <div className="mt-4">
                      <div className="font-semibold mb-1">Notes:</div>
                      <div className="bg-base-200 p-3 rounded-lg text-sm">{activeEntry.note}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <form className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Title</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="Entry title (e.g., Mathematics)" 
                        className="input input-bordered w-full" 
                        value={activeEntry.title || ''}
                        onChange={(e) => setActiveEntry({...activeEntry, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Day</span>
                        </label>
                        <select 
                          className="select select-bordered w-full"
                          value={activeEntry.day_of_week || 1}
                          onChange={(e) => {
                            const dayValue = parseInt(e.target.value);
                            setActiveEntry({
                              ...activeEntry, 
                              day_of_week: dayValue
                            });
                          }}
                        >
                          {days.map((day, idx) => (
                            <option key={idx} value={idx + 1}>{day}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Start</span>
                        </label>
                        <select 
                          className="select select-bordered w-full"
                          value={formatTimeForInput(activeEntry.start_time)}
                          onChange={(e) => {
                            setActiveEntry({
                              ...activeEntry,
                              start_time: `${e.target.value}:00`
                            });
                          }}
                        >
                          {timeOptions.map(time => (
                            <option key={`start-${time}`} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">End</span>
                        </label>
                        <select 
                          className="select select-bordered w-full"
                          value={formatTimeForInput(activeEntry.end_time)}
                          onChange={(e) => {
                            setActiveEntry({
                              ...activeEntry,
                              end_time: `${e.target.value}:00`
                            });
                          }}
                        >
                          {timeOptions
                            .filter(time => {
                              const startTime = formatTimeForInput(activeEntry.start_time);
                              return time > startTime;
                            })
                            .map(time => (
                              <option key={`end-${time}`} value={time}>{time}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Notes</span>
                        <span className="label-text-alt">Optional</span>
                      </label>
                      <textarea 
                        className="textarea textarea-bordered h-24" 
                        placeholder="Additional notes or details"
                        value={activeEntry.note || ''}
                        onChange={(e) => setActiveEntry({...activeEntry, note: e.target.value})}
                      ></textarea>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="modal-action mt-6">
                {modalMode === 'view' ? (
                  <>
                    {isEditable && (
                      <>
                        <button 
                          className="btn btn-error btn-sm"
                          onClick={handleDeleteClick}
                        >
                          Delete
                        </button>
                        <button 
                          className="btn btn-info btn-sm"
                          onClick={() => setModalMode('edit')}
                        >
                          Edit
                        </button>
                      </>
                    )}
                    <button className="btn" onClick={onClose}>Close</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button 
                      className="btn btn-primary" 
                      onClick={onSave}
                      disabled={!activeEntry.title}
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EntryModal;
