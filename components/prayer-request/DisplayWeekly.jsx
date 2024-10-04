
import React, { useEffect, useState } from 'react'
import DisplayGrid from './DisplayGrid'

function DisplayWeekly() {
    const [timeRange, setTimeRange] = useState(1);
  const [unit, setUnit] = useState('weeks'); // Default to weeks
  const [weeks, setWeeks] = useState(1)
  const [months, setMonths] = useState()

  const thisWeek = () => {
    setUnit('weeks');
    setTimeRange(1);
  };
  const prevWeek = () => {
    setUnit('weeks')
    setWeeks(weeks + 1)
    setTimeRange(weeks + 1)
    console.log(weeks, timeRange, 'clicked')
  }

  const handleMonthClick = (months) => {
    setUnit('months');
    setTimeRange(months);
  };
    
    return (
        <div className='prayer-weekly-container'>
            <div className="filter-controls">
            <button className='light-blue-button' onClick={() => thisWeek()}>This Week</button>
        <button className='red-button' onClick={() => prevWeek()}>Last Week</button>
        <button className='light-blue-button' onClick={() => handleMonthClick(1)}>This Month</button>
        <button className='red-button' onClick={() => handleMonthClick(2)}>Last Month</button>
      </div>
            
            <DisplayGrid timeRange={timeRange} unit={unit} />

        </div>
    )
}

export default DisplayWeekly