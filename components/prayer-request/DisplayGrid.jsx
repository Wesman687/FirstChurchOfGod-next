import { db } from '@/firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import RingSpinner from '../RingSpinner';

function DisplayPrayerRequests({ timeRange, unit }) {
  const [prayerRequest, setPrayerRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  console.log(start, end)
  useEffect(() => {
    setLoading(true);

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
      startDate = new Date(now.setMonth(now.getMonth() - timeRange));
      startDate.setDate(1); // Set to the first day of the month
      startDate.setHours(0, 0, 0, 0); // Set to start of the day

      // Calculate the end of that month
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1); // Move to the next month
      endDate.setDate(0); // Set to the last day of the current month
      endDate.setHours(23, 59, 59, 999); // Set to the end of the last day
    }
    setStart(startDate)
    setEnd(endDate)
    const q = query(
      collection(db, 'prayer-request'),
      where('createdAt', '>=', startDate), // Only include documents from start date
      where('createdAt', '<=', endDate), // Only include documents up to the end date
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPrayerRequest(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [timeRange, unit]);
  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : '';
  };

  return (
    <div className='prayer-weekly-container'>
        <h4>Displaying requests from <span className='light-blue bold'>{formatDate(start)}</span> to <span className='light-blue'>{formatDate(end)}</span></h4>
      {loading && <RingSpinner />}
      {prayerRequest.length > 0 ?<table>
        <thead>
          <tr className='prayer-table-head'>
            <td>Pray For</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          {prayerRequest.map((item, index) => (
              <tr key={index} className='prayer-table-body'>
                <td><label>{item.who}</label></td>
                <td><label>{item.prayerRequest}</label></td>
              </tr>
            ))}
        </tbody>
      </table> : <h2>Prayer Request List Empty</h2>}
    </div>
  );
}

export default DisplayPrayerRequests;
