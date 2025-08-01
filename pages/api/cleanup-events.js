export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    console.log('Starting simple cleanup');

    // Import Firebase functions inline to avoid potential import issues
    const { collection, getDocs, deleteDoc, doc } = await import('firebase/firestore');
    const { db } = await import('@/firebase');

    console.log('Firebase imports successful');

    // Get all events
    const eventsRef = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsRef);
    
    console.log(`Found ${eventsSnapshot.docs.length} events`);
    
    let eventsRemoved = 0;
    let eventsKept = 0;

    // Process each event
    for (const eventDoc of eventsSnapshot.docs) {
      try {
        const eventData = eventDoc.data();
        const title = eventData.title || '';
        
        // Check if this is a CWC event
        const isCWC = title.toLowerCase().includes('christian women') ||
                     title.toLowerCase().includes('cwc') ||
                     title.toLowerCase().includes('women connection') ||
                     title.toLowerCase().includes('christian woman');

        if (isCWC) {
          console.log(`Keeping CWC event: ${title}`);
          eventsKept++;
        } else {
          console.log(`Removing event: ${title}`);
          await deleteDoc(doc(db, 'events', eventDoc.id));
          eventsRemoved++;
        }
      } catch (eventError) {
        console.error(`Error processing event:`, eventError);
        eventsRemoved++;
      }
    }

    const message = `Cleanup completed. Removed ${eventsRemoved} events, kept ${eventsKept} CWC events.`;
    console.log(message);

    res.status(200).json({
      message,
      eventsRemoved,
      eventsKept,
      totalReviewed: eventsSnapshot.docs.length
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ 
      error: 'Failed to cleanup events',
      details: error.message 
    });
  }
}
