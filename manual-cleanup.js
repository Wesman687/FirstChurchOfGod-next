// Manual cleanup script - run this in browser console while on your website
// This will remove all events except CWC events

async function cleanupEvents() {
  try {
    console.log('Starting manual cleanup...');
    
    // This assumes you have Firebase initialized on the page
    const { collection, getDocs, deleteDoc, doc } = window.firebase.firestore;
    const db = window.firebase.firestore();
    
    // Get all events
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    const allEvents = eventsSnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    
    console.log(`Found ${allEvents.length} events to review`);
    
    let removed = 0;
    let kept = 0;
    
    for (const event of allEvents) {
      const title = event.title || '';
      const isCWC = title.toLowerCase().includes('christian women') ||
                   title.toLowerCase().includes('cwc') ||
                   title.toLowerCase().includes('women connection') ||
                   title.toLowerCase().includes('christian woman');
      
      if (isCWC) {
        console.log(`Keeping: ${title}`);
        kept++;
      } else {
        console.log(`Removing: ${title}`);
        await deleteDoc(doc(db, 'events', event.id));
        removed++;
      }
    }
    
    console.log(`Cleanup complete! Removed: ${removed}, Kept: ${kept}`);
    return { removed, kept, total: allEvents.length };
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return { error: error.message };
  }
}

// Run the cleanup
cleanupEvents();
