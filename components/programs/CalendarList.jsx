import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // month view
import timeGridPlugin from '@fullcalendar/timegrid'; // daily and weekly views
import listPlugin from '@fullcalendar/list'; // list view (weekly and daily)
import interactionPlugin from '@fullcalendar/interaction'; // for selectable feature
import { useEffect, useRef, useState } from 'react';
import { createTheme, CssBaseline, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeEventModal, openEventModal } from '@/redux/modalSlice';
import { toast } from 'react-toastify';
import { ColorPicker } from './ColorPicker';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { ThemeProvider } from '@emotion/react';

const testEvents = [
  {
    id: '1',
    title: 'Project Meeting',
    start: '2024-09-29T15:00:00',
    url: 'https://example.com/event-details',
    backgroundColor: '#ff0000',
    textColor: '#ffffff',
    classNames: ['custom-event-class'],
    editable: true,
    durationEditable: true,
    startEditable: true,
    extendedProps: {
      department: 'Engineering',
      manager: 'John Doe',
      description: 'Discuss project milestones',
      location: 'Conference Room A'
    }
  }
];

const FullCalendarComponent = () => {
  const calendarRef = useRef(null); // Reference to access FullCalendar instance
  const [events, setEvents] = useState([testEvents]);
  const [startAMPM, setStartAMPM] = useState('AM')
  const [disableTime, setDisableTime] = useState(false)
  const [newEventData, setNewEventData] = useState({ title: '', description: '', location: '' });
  const [selectedDate, setSelectedDate] = useState(null);
  const isOpen = useSelector(state => state.modals.eventModalOpen)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [selectedEvent, setSelectedEvent] = useState(null); // Store the selected event for deletion

  const handleEventClick = async (clickInfo) => {
    setSelectedEvent(clickInfo.event); // Store the event object for deletion
    setNewEventData(events.filter((item) => item.id == clickInfo.event._def.publicId).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.extendedProps.description,
      location: item.extendedProps.location,
      backgroundColor: handleBgColorChange(item.backgroundColor),
      textColor: handleTextColorChange(item.textColor),
      URL: item.url
    }))[0])
    dispatch(openEventModal()); // Open the modal to edit/delete event
  };
  async function findById(id) {
    const docRef = await query(
      collection(db, "events"), where('id', '==', +id)
    );
    const data = await getDocs(docRef);
    if (data.empty) {
      console.log("nothing");
    }
    const eventInfo = data.docs[0]
    return eventInfo
  }
  const handleEventRemove = async () => {

    const id = selectedEvent.id
    const docRef = await findById(id)

    await deleteDoc(doc(db, 'events', docRef.id)); // Adjust this to match how you're storing event IDs


    // Remove event from FullCalendar
    selectedEvent.remove();

    // Update local state (optional)
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));

    // Close the modal
    dispatch(closeEventModal());

  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    return color
  };

  const handleBgColorChange = (color) => {
    setBgColor(color);
    return color
  };
  const handleDateSelect = (arg) => {
    if (user.isAdmin) {
      if (arg.startStr.length > 10) {
        setDisableTime(true)
      }
      else {
        setDisableTime(false)
      }
      setSelectedDate(arg); // Store the selected date
      dispatch(openEventModal()); // Open the modal for input
    };
  }
  const customTheme = createTheme({
    palette: {
      mode: 'light', // You can switch to 'dark' mode if needed
      primary: {
        main: '#000000', // Primary color
      },
      secondary: {
        main: '#000000', // Secondary color
      },
      background: {
        default: '#000000', // Background color
      },
      text: {
        primary: '#000000', // Text color
      },
    },
  });

  function handleTime(temp) {
    let finalTime
    if (temp[1] === ':') {
      temp = '0' + temp
    }
    if (temp.slice(0, 2) > 12 || temp.length !== 7 || temp.slice(3, 5) >= 60) {
      toast.warning('Check Time')
      return false
    }
    if (temp.slice(5, 7).toUpperCase() === 'PM') {

      if (temp.slice(0, 2) === '12') {
        finalTime = temp.slice(0, 2) + ':' + temp.slice(3, 5)
      }
      else {
        finalTime = (12 + +temp.slice(0, 2)).toString() + ':' + temp.slice(3, 5)
      }
    }
    else if (temp.slice(5, 7).toUpperCase() === 'AM') {
      if (temp.slice(0, 2) === '12') {
        finalTime = "00" + ':' + temp.slice(3, 5)
      }
      else {
        finalTime = temp.slice(0, 2) + ':' + temp.slice(3, 5)
      }
    }
    return (finalTime + ':00')
  }
  function subtractOneDay(dateString) {
    const date = new Date(dateString); // Convert string to Date object
    date.setDate(date.getDate() - 1);  // Subtract one day
    return date.toISOString().split('T')[0]; // Return the date part as a string (YYYY-MM-DD)
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let startTime = '';
    let { title, description, location, URL } = newEventData;

    // Handle AM/PM conversion using your handleTime function
    startTime = newEventData.startTime + startAMPM;
    let formattedStartTime
    let newEvent = {};
    
    formattedStartTime = handleTime(startTime);
    
    // Check if both start and end times are provided and valid
    if (title) {
      newEvent = {
        title,
        id: events.length + 1,
        start: `${selectedDate.startStr}T${formattedStartTime}`,         

        end: ((selectedDate.startStr !== subtractOneDay(selectedDate.endStr)) && `${subtractOneDay(selectedDate.endStr)}T${formattedStartTime}`),
        
        backgroundColor: bgColor,
        textColor: textColor,
        url: URL || '',
        allDay: false, // Ensure the event is not marked as all-day
        extendedProps: {
          description,
          location,
        },
      };
    

      setEvents((prevEvents) => [...prevEvents, newEvent]);

      // Add it directly to the calendar instance
      const calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent(newEvent);
      const docRef = await addDoc(collection(db, 'events'), newEvent)

      // Close the modal and reset the form
      dispatch(closeEventModal());
      setNewEventData({ title: '', description: '', location: '', startTime: '', endTime: '' });
      setDisableTime(false)
    } else {
      toast.warning('Please provide a valid title and time.');
    }
  };
  useEffect(() => {
    const q = query(collection(db, 'events'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
      setEvents(data.map((item) => item.data()))
    })
    return unsubscribe
  }, [])

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <div>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          select={handleDateSelect} // Use select for date selection
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,listDay',
          }}
          views={{
            dayGridMonth: { buttonText: 'Month' },
            timeGridWeek: { buttonText: 'Week' },
            timeGridDay: { buttonText: 'Day' },
            listWeek: { buttonText: 'Weekly List' },
            listDay: { buttonText: 'Daily List' },
          }}
          events={events}
          eventClick={handleEventClick} // Attach eventClick handler
        />
        <Modal
          open={isOpen}
          onClose={() => dispatch(closeEventModal())}
          className="settings__modal contact__modal"
        >
          <div className="login__container">
            <div className="login">
              <div className="login-form">
                <div className="modal">
                  <form onSubmit={handleFormSubmit}>
                    <label>
                      Event Title:
                      <input
                        type="text"
                        value={newEventData.title}
                        onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Description:
                      <input
                        type="text"
                        value={newEventData.description}
                        onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                      />
                    </label>
                    <label>
                      Location:
                      <input
                        type="text"
                        value={newEventData.location}
                        onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                      />
                    </label>
                    <div className='time-inputs'>
                      {!disableTime && <label>
                        Start Time:
                        <div className='calender-am-pm'>
                          <input
                            type="text"
                            value={newEventData.startTime}
                            placeholder='4:00'
                            onChange={(e) => setNewEventData({ ...newEventData, startTime: e.target.value })}
                          />
                          <select className='calendar-am-select' default={startAMPM} onChange={(e) => setStartAMPM(e.target.value)}>
                            <option value={'AM'}>AM</option>
                            <option value={'PM'}>PM</option>
                          </select>
                        </div>
                      </label>}                      
                    </div>
                    <div style={{ padding: '2px', backgroundColor: bgColor, color: textColor }}>
                      <ColorPicker onColorSelect={handleTextColorChange} defaultColor={textColor} />
                      <ColorPicker onColorSelect={handleBgColorChange} defaultColor={bgColor} />
                      <p>Select text and background colors!</p>
                    </div>

                    {selectedEvent ?
                      <>
                        <button type="button" className="red-button" onClick={handleEventRemove}>
                          Delete Event
                        </button>
                        <button type="button" className="cancel-button submit" onClick={() => {
                          dispatch(closeEventModal())
                          setSelectedEvent(null)
                          setNewEventData('')
                        }}>
                          Cancel
                        </button>
                      </>
                      : <><button type="submit" className='submit'>Add Event</button>
                        <button type="button" className='red-button' onClick={() => dispatch(closeEventModal())}>
                          Cancel
                        </button></>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default FullCalendarComponent;
