import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    console.log('Clearing all weekly events from calendar');

    // Get all events marked as weekly events
    const eventsRef = collection(db, 'events');
    const weeklyEventsQuery = query(
      eventsRef,
      where('weeklyEvent', '==', true)
    );
    
    const weeklyEventsSnapshot = await getDocs(weeklyEventsQuery);
    const weeklyEvents = weeklyEventsSnapshot.docs;

    console.log(`Found ${weeklyEvents.length} weekly events to remove`);

    let eventsRemoved = 0;

    // Remove all weekly events
    for (const eventDoc of weeklyEvents) {
      const eventData = eventDoc.data();
      console.log(`Removing weekly event: ${eventData.title} (${eventData.weeklyEventId})`);
      await deleteDoc(doc(db, 'events', eventDoc.id));
      eventsRemoved++;
    }

    const message = `Successfully removed ${eventsRemoved} weekly events from calendar`;
    console.log(message);

    res.status(200).json({
      message,
      eventsRemoved
    });

  } catch (error) {
    console.error('Error clearing weekly events:', error);
    res.status(500).json({ 
      error: 'Failed to clear weekly events',
      details: error.message 
    });
  }
}
