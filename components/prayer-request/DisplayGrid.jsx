import { db } from '@/firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import RingSpinner from '../RingSpinner';

function DisplayPrayerRequests({ start, end, blackAndWhite }) {
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

  return (
    <>        
      
      {prayerRequest.length > 0 ?<table>
        <thead>
          <tr className={blackAndWhite ? 'prayer-table-head blackandwhite-head' : 'prayer-table-head bluebg-head'}>
            <td>Pray For</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          {!loading && prayerRequest.map((item, index) => (
              <tr key={index} className={blackAndWhite ? 'prayer-table-body blackandwhite-body' : 'prayer-table-body bluebg-body'}>
                <td><label>{item.who}</label></td>
                <td><label>{item.prayerRequest}</label></td>
              </tr>
            ))}
        </tbody>
        
      </table> : <h2>Prayer Request List Empty</h2>}
      
      {loading && <RingSpinner classes={'center'} />}
    </>
  );
}

export default DisplayPrayerRequests;
