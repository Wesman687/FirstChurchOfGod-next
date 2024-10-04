import { db } from '@/firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import RingSpinner from '../RingSpinner';

function DisplayPrayerRequests({ start, end }) {
  const [prayerRequest, setPrayerRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);

    
    const q = query(
      collection(db, 'prayer-request'),
      where('createdAt', '>=', start), // Only include documents from start date
      where('createdAt', '<=', end), // Only include documents up to the end date
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
  }, [start, end]);
  
  console.log(start, end)

  return (
    <>        
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
    </>
  );
}

export default DisplayPrayerRequests;
