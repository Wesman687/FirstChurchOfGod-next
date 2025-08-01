import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Default weekly events template
const defaultWeeklyEvents = [
  {
    id: 1,
    title: 'Bible Study',
    dayOfWeek: 4, // Thursday
    startTime: '17:30',
    endTime: '18:30',
    location: 'Back Door',
    description: 'Weekly Bible Study session',
    backgroundColor: '#4CAF50',
    textColor: '#FFFFFF',
    active: true
  },
  {
    id: 2,
    title: 'Bible Reading',
    dayOfWeek: 0, // Sunday
    startTime: '09:15',
    endTime: '09:45',
    location: 'Main Sanctuary',
    description: 'Weekly Bible Reading session',
    backgroundColor: '#2196F3',
    textColor: '#FFFFFF',
    active: true
  },
  {
    id: 3,
    title: 'Sunday Service',
    dayOfWeek: 0, // Sunday
    startTime: '10:00',
    endTime: '11:30',
    location: 'Main Sanctuary',
    description: 'Weekly Sunday worship service',
    backgroundColor: '#FF9800',
    textColor: '#FFFFFF',
    active: true
  }
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function WeeklyEventsManager() {
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user);

  const loadWeeklyEvents = useCallback(async () => {
    try {
      console.log('Loading weekly events configuration...');
      const response = await fetch('/api/weekly-events-config');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded data:', data);
        setWeeklyEvents(data.weeklyEvents || defaultWeeklyEvents);
      } else {
        console.log('No existing config, using defaults');
        // If no config exists, use defaults
        setWeeklyEvents(defaultWeeklyEvents);
      }
    } catch (error) {
      console.error('Error loading weekly events:', error);
      // Fall back to defaults if there's an error
      setWeeklyEvents(defaultWeeklyEvents);
      toast.error('Error loading weekly events configuration. Using defaults.');
    }
  }, []);

  useEffect(() => {
    loadWeeklyEvents();
  }, [loadWeeklyEvents]);

  const saveWeeklyEvents = async () => {
    try {
      console.log('Saving weekly events:', weeklyEvents);
      const response = await fetch('/api/weekly-events-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyEvents })
      });

      console.log('Save response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Save result:', result);
        toast.success('Weekly events configuration saved!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        throw new Error(errorData.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving weekly events:', error);
      toast.error(`Error saving weekly events configuration: ${error.message}`);
    }
  };

  const generateEvents = async () => {
    if (!user.isAdmin) {
      toast.error('Only administrators can generate events');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-weekly-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyEvents: weeklyEvents })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('API Response:', result);
        
        // Create detailed success message
        let message = result.message;
        if (result.eventsRemoved > 0 || result.eventsAdded > 0 || result.eventsUpdated > 0) {
          const details = [];
          if (result.eventsAdded > 0) details.push(`${result.eventsAdded} events added`);
          if (result.eventsUpdated > 0) details.push(`${result.eventsUpdated} events updated`);
          if (result.eventsRemoved > 0) details.push(`${result.eventsRemoved} events removed`);
          if (result.eventsSkipped > 0) details.push(`${result.eventsSkipped} events skipped (already exist)`);
          message += ` (${details.join(', ')})`;
        }
        
        toast.success(message);
      } else {
        toast.error(result.error || 'Failed to generate events');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error generating weekly events');
    } finally {
      setLoading(false);
    }
  };

  const addNewEvent = () => {
    const newEvent = {
      id: Math.max(...weeklyEvents.map(e => e.id), 0) + 1,
      title: 'New Event',
      dayOfWeek: 0,
      startTime: '10:00',
      endTime: '11:00',
      location: 'Main Sanctuary',
      description: 'New weekly event',
      backgroundColor: '#9C27B0',
      textColor: '#FFFFFF',
      active: true
    };
    setWeeklyEvents([...weeklyEvents, newEvent]);
  };

  const updateEvent = (id, field, value) => {
    setWeeklyEvents(weeklyEvents.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const removeEvent = (id) => {
    setWeeklyEvents(weeklyEvents.filter(event => event.id !== id));
  };

  const toggleEventActive = (id) => {
    setWeeklyEvents(weeklyEvents.map(event => 
      event.id === id ? { ...event, active: !event.active } : event
    ));
  };

  if (!user.isAdmin) {
    return (
      <div className="weekly-events-unauthorized">
        <h3>Access Denied</h3>
        <p>Only administrators can manage weekly events.</p>
      </div>
    );
  }

  return (
    <div className="weekly-events-manager">
      <div className="weekly-events-header">
        <h2>Weekly Events Management</h2>
        <div className="weekly-events-actions">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-events-btn"
              >
                Edit Weekly Events
              </button>
              <button 
                onClick={generateEvents}
                disabled={loading}
                className="generate-events-btn"
              >
                {loading ? 'Processing...' : 'Sync Calendar Events'}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={saveWeeklyEvents}
                className="save-events-btn"
              >
                Save Configuration
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  loadWeeklyEvents(); // Reset changes
                }}
                className="cancel-events-btn"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="weekly-events-info">
          <p><strong>How it works:</strong> Configure your weekly recurring events below, then click &quot;Sync Calendar Events&quot; to automatically add them to the calendar. The system will add missing events and remove events that are no longer configured. Manual events are never affected.</p>
        </div>
      )}

      <div className="weekly-events-list">
        {weeklyEvents.map(event => (
          <div 
            key={event.id} 
            className={`weekly-event-card ${!event.active ? 'inactive' : ''}`}
          >
            <div className="event-header">
              <div className="event-title-section">
                {isEditing ? (
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                    className="event-title-input"
                  />
                ) : (
                  <h3 style={{ color: event.backgroundColor }}>{event.title}</h3>
                )}
                
                <label className="event-active-toggle">
                  <input
                    type="checkbox"
                    checked={event.active}
                    onChange={() => toggleEventActive(event.id)}
                    disabled={!isEditing}
                  />
                  Active
                </label>
              </div>

              {isEditing && (
                <button 
                  onClick={() => removeEvent(event.id)}
                  className="remove-event-btn"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="event-details">
              <div className="event-timing">
                <label>
                  Day:
                  {isEditing ? (
                    <select
                      value={event.dayOfWeek}
                      onChange={(e) => updateEvent(event.id, 'dayOfWeek', parseInt(e.target.value))}
                    >
                      {dayNames.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{dayNames[event.dayOfWeek]}</span>
                  )}
                </label>

                <label>
                  Start Time:
                  {isEditing ? (
                    <input
                      type="time"
                      value={event.startTime}
                      onChange={(e) => updateEvent(event.id, 'startTime', e.target.value)}
                    />
                  ) : (
                    <span>{event.startTime}</span>
                  )}
                </label>

                <label>
                  End Time:
                  {isEditing ? (
                    <input
                      type="time"
                      value={event.endTime}
                      onChange={(e) => updateEvent(event.id, 'endTime', e.target.value)}
                    />
                  ) : (
                    <span>{event.endTime}</span>
                  )}
                </label>
              </div>

              <div className="event-location">
                <label>
                  Location:
                  {isEditing ? (
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => updateEvent(event.id, 'location', e.target.value)}
                    />
                  ) : (
                    <span>{event.location}</span>
                  )}
                </label>
              </div>

              <div className="event-description">
                <label>
                  Description:
                  {isEditing ? (
                    <textarea
                      value={event.description}
                      onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                      rows="2"
                    />
                  ) : (
                    <span>{event.description}</span>
                  )}
                </label>
              </div>

              {isEditing && (
                <div className="event-colors">
                  <label>
                    Background Color:
                    <input
                      type="color"
                      value={event.backgroundColor}
                      onChange={(e) => updateEvent(event.id, 'backgroundColor', e.target.value)}
                    />
                  </label>
                  <label>
                    Text Color:
                    <input
                      type="color"
                      value={event.textColor}
                      onChange={(e) => updateEvent(event.id, 'textColor', e.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <button 
          onClick={addNewEvent}
          className="add-event-btn"
        >
          Add New Weekly Event
        </button>
      )}
    </div>
  );
}

export default WeeklyEventsManager;
