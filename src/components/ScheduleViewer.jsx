import React, { useRef, useEffect, useState, useCallback } from 'react';
import EntryModal from './EntryModal';

function ScheduleViewer({ 
  entries = [], 
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
  showWeekend = true,
  title = "Weekly Schedule",
  initialView = "normal",
  isEditable = false,
  onAddEntry = null,
  onEditEntry = null,
  onDeleteEntry = null,
  onAddButtonClick = null
}) {
  const colorOptions = [
    'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    'from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
    'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
    'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
    'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
  ];
  
  // Component state
  const displayDays = showWeekend ? days : days.slice(0, 5);
  const [activeEntry, setActiveEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const scrollContainerRef = useRef(null);
  const scheduleContainerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(initialView === 'expanded');

  const formatTimeString = (hour, minute = 0) => {
    // Ensure hour and minute are properly formatted with leading zeros
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute}:00`;
  };

  // Handle adding a new entry
  const handleAddButtonClick = useCallback((dayIndex = 0, hour = 8) => {
    if (!isEditable) return;
    
    if (onAddButtonClick) {
      // Pass the selected day and hour to the parent's handler
      onAddButtonClick(dayIndex, hour);
      return;
    }
    
    const newEntryTemplate = {
      day_of_week: dayIndex + 1,
      start_time: formatTimeString(hour),
      end_time: formatTimeString(hour + 1),
      title: '',
      note: '',
      schedule_id: entries[0]?.schedule_id || null
    };
    
    setActiveEntry(newEntryTemplate);
    setModalMode('add');
    setIsModalOpen(true);
  }, [isEditable, onAddButtonClick, entries]);

  const processedEntries = entries.map(entry => {
    const getTimeComponents = (timeStr) => {
      if (!timeStr) return { hour: 0, minute: 0 };
      const parts = timeStr.split(':');
      return {
        hour: parseInt(parts[0], 10),
        minute: parseInt(parts[1], 10)
      };
    };
    
    const dayIndex = typeof entry.day_of_week === 'number' 
      ? entry.day_of_week - 1 
      : 0;
    
    const startTime = typeof entry.start === 'number' 
      ? { hour: entry.start, minute: 0 } 
      : getTimeComponents(entry.start_time);
    
    const endTime = typeof entry.end === 'number' 
      ? { hour: entry.end, minute: 0 } 
      : getTimeComponents(entry.end_time);
    
    // Calculate decimal hours for precise positioning
    const startDecimal = startTime.hour + (startTime.minute / 60);
    const endDecimal = endTime.hour + (endTime.minute / 60);
    
    const getColorIndex = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
      }
      return Math.abs(hash) % colorOptions.length;
    };
    
    return {
      ...entry,
      dayIndex,
      startHour: startTime.hour,
      startMinute: startTime.minute,
      endHour: endTime.hour,
      endMinute: endTime.minute,
      startDecimal: startDecimal,
      endDecimal: endDecimal,
      colorIndex: getColorIndex(entry.title || '') 
    };
  });

  const earliestHour = processedEntries.length > 0 
    ? Math.max(0, Math.floor(Math.min(...processedEntries.map(entry => entry.startDecimal))) - 1)
    : 7; 
  const latestHour = processedEntries.length > 0
    ? Math.min(24, Math.ceil(Math.max(...processedEntries.map(entry => entry.endDecimal))) + 1)
    : 18;
  const hours = Array.from({ length: latestHour - earliestHour }, (_, i) => earliestHour + i);

  const formatTime = (hour, minute = 0) => {
    return `${hour}:${minute.toString().padStart(2, '0')}`;
  };

  // Simple handlers for modal interactions
  const handleEntryClick = (entry, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setActiveEntry(entry);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddEntry = (dayIndex, hour) => {
    if (!isEditable || !onAddEntry) return;
    handleAddButtonClick(dayIndex, hour);
  };

  const handleSaveEntry = async () => {
    try {
      if (modalMode === 'add') {
        await onAddEntry(activeEntry);
      } else if (modalMode === 'edit') {
        await onEditEntry(activeEntry);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleDeleteEntry = async () => {
    try {
      await onDeleteEntry(activeEntry.id);
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const toggleFullscreen = () => {
    if (isExpanded) {
      exitFullscreen();
    } else {
      if (scheduleContainerRef.current) {
        scheduleContainerRef.current.classList.add('schedule-pre-fullscreen');
        const rect = scheduleContainerRef.current.getBoundingClientRect();
        const originX = rect.width / 2;
        const originY = rect.height / 2;
        document.documentElement.style.setProperty('--schedule-origin-x', `${originX}px`);
        document.documentElement.style.setProperty('--schedule-origin-y', `${originY}px`);
        setTimeout(() => {
          document.body.classList.add('schedule-fullscreen-active');
          document.body.style.overflow = 'hidden';
          setIsExpanded(true);
          setTimeout(() => {
            scheduleContainerRef.current?.classList.remove('schedule-pre-fullscreen');
          }, 100);
        }, 100);
      }
    }
  };
  
  // Function to exit fullscreen mode
  const exitFullscreen = () => {
    if (scheduleContainerRef.current) {
      scheduleContainerRef.current.classList.add('schedule-exiting-fullscreen');
      document.body.classList.add('schedule-exit-animation');
      setTimeout(() => {
        document.body.classList.remove('schedule-fullscreen-active');
        document.body.style.overflow = 'auto';
        setIsExpanded(false);
        setTimeout(() => {
          document.body.classList.remove('schedule-exit-animation');
          scheduleContainerRef.current?.classList.remove('schedule-exiting-fullscreen');
        }, 500);
      }, 300);
    }
  };

  const addButton = isEditable && (
    <button 
      className="btn btn-sm btn-primary ml-2"
      onClick={() => handleAddButtonClick()}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Add
    </button>
  );

  useEffect(() => {
    const handleScrollEvents = (event) => {
      if (isModalOpen || document.body.classList.contains('modal-opening')) {
        event.stopPropagation();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvents, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScrollEvents);
      }
    };
  }, [isModalOpen]);

  // Add ESC key event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isExpanded) {
        exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  return (
    <div className="schedule-wrapper">
      <div 
        ref={scheduleContainerRef}
        className={`
          schedule-container
          ${isExpanded ? 'schedule-fullscreen' : ''}
          ${isExpanded ? 'fixed inset-0 z-40 bg-base-100' : 'bg-base-100 rounded-xl shadow-xl mb-6'}
        `}
      >
        <div className={`${isExpanded ? 'h-full flex flex-col p-4' : 'p-6'} max-w-full mx-auto`}>
          <div className="flex justify-between items-center mb-6 schedule-header">
            <h2 className="text-2xl font-bold text-center flex-grow">
              {title}
            </h2>
            <div className="flex items-center">
              <div className="badge badge-outline p-3">
                {processedEntries.length > 0 ? `${earliestHour}:00 - ${latestHour}:00` : 'No entries'}
              </div>
              {addButton}
              <button 
                className="btn btn-sm ml-4 transition-all"
                onClick={toggleFullscreen}
              >
                {isExpanded ? 'Exit Full Screen' : 'Full Screen'}
              </button>
            </div>
          </div>

          <div 
            className={`relative ${isExpanded ? 'flex-grow' : ''} always-show-scrollbar`} 
            ref={scrollContainerRef} 
            style={{ 
              overflowX: 'auto', 
              overflowY: isExpanded ? 'hidden' : 'auto',
              minHeight: processedEntries.length === 0 ? '300px' : 'auto',
            }}
          >
            {processedEntries.length > 0 ? (
              <div
                className={`grid border border-base-300 rounded-lg schedule-grid ${
                  isExpanded ? 'h-full schedule-grid-expanded' : ''
                }`}
                style={{
                  gridTemplateColumns: `100px repeat(${hours.length}, minmax(${isExpanded ? '120px' : '90px'}, 1fr))`,
                  gridTemplateRows: `50px repeat(${displayDays.length}, ${isExpanded ? '1fr' : '70px'})`,
                  overflow: 'hidden',
                  minWidth: 'max-content',
                  height: isExpanded ? '100%' : 'auto',
                }}
              >
                <div className="border-r border-b border-base-300 bg-base-200 sticky left-0 z-20"></div>
                {hours.map(hour => (
                  <div 
                    key={hour} 
                    className={`text-center border-r border-b border-base-300 bg-base-200 flex flex-col justify-center font-medium text-base-content/80 ${
                      hour >= 8 && hour <= 17 ? 'bg-base-200' : 'bg-base-200/70'
                    }`}
                  >
                    {formatTime(hour)}
                  </div>
                ))}
                {displayDays.map((day, rowIdx) => (
                  <React.Fragment key={`day-row-${rowIdx}`}>
                    <div
                      className={`flex items-center justify-center text-base font-semibold text-base-content/80 border-r border-b border-base-300 bg-base-200 sticky left-0 z-10 ${
                        rowIdx >= 5 ? 'bg-base-200/70' : ''
                      }`}
                    >
                      {day}
                    </div>
                    {hours.map((hour, colIdx) => {
                      const hour_end = hour + 1;
                      const entry = processedEntries.find(
                        e => e.dayIndex === rowIdx && 
                            ((e.startDecimal < hour_end && e.endDecimal > hour) || 
                             (e.startHour === hour && e.startMinute === 0 && e.endHour === hour && e.endMinute > 0))
                      );
                      const isFirstHourOfEntry = entry && entry.startHour === hour;
                      const isWorkHour = hour >= 8 && hour <= 17;
                      const isWeekend = rowIdx >= 5;
                      
                      return (
                        <div 
                          key={`cell-${rowIdx}-${colIdx}`} 
                          className={`relative border-r border-b border-base-300 ${
                            !entry ? 'hover:bg-base-200/30 transition-colors duration-200' : ''
                          } ${isWorkHour && !isWeekend ? '' : 'bg-base-100/50'}`}
                          onClick={() => !entry && isEditable && handleAddEntry(rowIdx, hour)}
                        >
                          {isFirstHourOfEntry && (
                            <div
                              className={`absolute bg-gradient-to-br ${
                                colorOptions[entry.colorIndex || 0]
                              } text-white rounded-lg schedule-entry flex items-center px-3 ${
                                // Add classes based on entry duration
                                (() => {
                                  const durationMinutes = (entry.endDecimal - entry.startDecimal) * 60;
                                  if (durationMinutes <= 15) return 'schedule-entry-very-short';
                                  if (durationMinutes <= 30) return 'schedule-entry-short';
                                  return '';
                                })()
                              }`}
                              style={{
                                top: '0.25rem',
                                bottom: '0.25rem',
                                left: `${(entry.startMinute / 60) * 100}%`,
                                right: `${100 - ((entry.endDecimal - entry.startHour) / (hours.length) * 100)}%`,
                                width: `calc(${(entry.endDecimal - entry.startDecimal) * 100}% - ${(Math.ceil(entry.endDecimal) - Math.floor(entry.startDecimal) - 1) * 1}px)`,
                                zIndex: 10,
                              }}
                              onClick={(e) => handleEntryClick(entry, e)}
                            >
                              {(() => {
                                const durationMinutes = (entry.endDecimal - entry.startDecimal) * 60;
                                const isVeryShort = durationMinutes <= 15;
                                const isShort = durationMinutes <= 30;
                                
                                return (
                                  <>
                                    <div className="entry-content">
                                      <span className={`font-medium ${isExpanded ? 'text-base' : 'text-sm'} truncate`}>
                                        {isVeryShort ? entry.title.substring(0, 3) + (entry.title.length > 3 ? '...' : '') : entry.title}
                                      </span>
                                      {isExpanded && !isVeryShort && (
                                        <span className="ml-2 opacity-75 text-xs entry-time">
                                          {formatTime(entry.startHour, entry.startMinute)} - {formatTime(entry.endHour, entry.endMinute)}
                                        </span>
                                      )}
                                    </div>
                                    {(isShort || isVeryShort) && (
                                      <div className="entry-tooltip">
                                        <strong>{entry.title}</strong>
                                        <div>
                                          {formatTime(entry.startHour, entry.startMinute)} - {formatTime(entry.endHour, entry.endMinute)}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-base-200/30 rounded-lg min-h-[300px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-base-content/70">No schedule entries yet</p>
                {isEditable && (
                  <button 
                    className="btn btn-primary mt-4"
                    onClick={() => handleAddButtonClick(0, 8)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add First Entry
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          {processedEntries.length > 0 && (
            <div className="flex justify-center mt-4 gap-4">
              <button 
                className="btn btn-sm"
                onClick={() => scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              >
                ← Earlier
              </button>
              <button 
                className="btn btn-sm"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const startPosition = (8 - earliestHour) * (isExpanded ? 120 : 90);
                    scrollContainerRef.current.scrollLeft = Math.max(0, startPosition);
                  }
                }}
              >
                Working Hours
              </button>
              <button 
                className="btn btn-sm"
                onClick={() => scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              >
                Later →
              </button>
            </div>
          )}
        </div>
        
        {/* Floating exit button in fullscreen mode */}
        {isExpanded && (
          <button 
            onClick={toggleFullscreen}
            className="fixed bottom-6 right-6 btn btn-circle btn-primary btn-lg shadow-lg z-50 animate-pulse hover:animate-none"
            aria-label="Exit Full Screen"
            style={{
              animation: "pulse-glow 2s infinite",
              boxShadow: "0 0 10px 3px rgba(255,255,255,0.3)"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <style jsx>{`
              @keyframes pulse-glow {
                0% { box-shadow: 0 0 5px 0 rgba(255,255,255,0.4); }
                50% { box-shadow: 0 0 15px 5px rgba(255,255,255,0.6); }
                100% { box-shadow: 0 0 5px 0 rgba(255,255,255,0.4); }
              }
            `}</style>
          </button>
        )}
      </div>
      
      {/* Modal render */}
      {isModalOpen && (
        <EntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          activeEntry={activeEntry}
          setActiveEntry={setActiveEntry}
          modalMode={modalMode}
          setModalMode={setModalMode}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
          isEditable={isEditable}
          days={days}
        />
      )}
    </div>
  );
}

export default ScheduleViewer;
