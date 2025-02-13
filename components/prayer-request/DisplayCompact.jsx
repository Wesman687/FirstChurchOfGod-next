import React, { useEffect, useState } from 'react';
import DisplayGrid from './DisplayGrid';

function DisplayCompact() {
  const [timeRange, setTimeRange] = useState(1);
  const [unit, setUnit] = useState('weeks'); // Default to weeks
  const [weeks, setWeeks] = useState(1);
  const [months, setMonths] = useState(1);
  const [blackAndWhite, setBlackAndWhite] = useState(false) 
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  // This useEffect will update the `start` and `end` dates when `timeRange` or `unit` changes.
  useEffect(() => {
    const now = new Date();
    let startDate, endDate;

    if (unit === 'weeks') {
      // Go back to the start of the week we are going to
      startDate = new Date(now.setDate(now.getDate() - (7 * timeRange)));
      startDate.setHours(0, 0, 0, 0); // Set to start of the day (00:00)

      // Calculate the end of that week (7 days after the start)
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      endDate.setHours(23, 59, 59, 999); // Set to end of the day (23:59)
    } else if (unit === 'months') {
      // Go back to the start of the month we are going to
      startDate = new Date(now); // Create a copy of the current date
      startDate.setMonth(now.getMonth() - (timeRange - 1)); // Adjust timeRange to start on the current month
      startDate.setDate(1); // Set to the first day of the month
      startDate.setHours(0, 0, 0, 0); // Set to start of the day

      // Calculate the end of that month
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1); // Move to the next month
      endDate.setDate(0); // Set to the last day of the current month
      endDate.setHours(23, 59, 59, 999); // Set to the end of the last day
    }

    setStart(startDate);
    setEnd(endDate);
  }, [timeRange, unit]); // The effect runs only when `timeRange` or `unit` changes.

  const thisWeek = () => {
    setUnit('weeks');
    setWeeks(1);
    setTimeRange(1); // Reset timeRange for this week
  };

  const prevWeek = () => {
    setUnit('weeks');
    setWeeks(prevWeeks => {
      const newWeeks = prevWeeks + 1;
      setTimeRange(newWeeks); // Update `timeRange` to match `weeks`
      return newWeeks;
    });
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : '';
  };

  const thisMonth = () => {
    setUnit('months');
    setMonths(1);
    setTimeRange(1); // Reset timeRange for this month
  };

  const prevMonth = () => {
    setUnit('months');
    setMonths(prevMonths => {
      const newMonths = prevMonths + 1; // Increase the number of months to go back
      setTimeRange(newMonths); // Update `timeRange` to match the newMonths
      return newMonths;
    });
  };
  const BlackAndWhite = () =>{
    setBlackAndWhite(prev => !prev)
  }

  return (
    <div className='prayer-weekly-container'>
      <h4>Displaying requests from <span className='light-blue bold'>{formatDate(start)}</span> to <span className='light-blue'>{formatDate(end)}</span></h4>
      <div className="filter-controls">
        <div>
          {unit === 'weeks' && timeRange === 1 ? <button className='' onClick={thisWeek}>This Week</button> : <button className='light-blue-button' onClick={thisWeek}>This Week</button>}
          <button className='red-button' onClick={prevWeek}>Last Week</button>
          {blackAndWhite ? <button className='black-button black-button-active' onClick={BlackAndWhite}>B&W</button> : <button className='black-button' onClick={BlackAndWhite}>B&W</button>}
        </div>
        <div>
          {unit === 'months' && timeRange === 1 ? <button className='' onClick={thisMonth}>This Month</button> : <button className='light-blue-button' onClick={thisMonth}>This Month</button>}
          <button className='red-button' onClick={prevMonth}>Last Month</button>
        </div>
      </div>

      {/* Pass the calculated start and end dates to the DisplayGrid component */}
      {start && end && <DisplayGrid start={start} end={end} blackAndWhite={blackAndWhite} />}
    </div>
    
  );
}

export default DisplayCompact;
