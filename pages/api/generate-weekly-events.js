import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { weeklyEvents } = req.body;
    
    if (!weeklyEvents || !Array.isArray(weeklyEvents)) {
      return res.status(400).json({ error: 'Invalid weekly events data' });
    }

    console.log('Generating events for weekly events:', weeklyEvents);

    // Get existing weekly events (only ones marked as weeklyEvent: true)
    const eventsRef = collection(db, 'events');
    const weeklyEventsQuery = query(
      eventsRef,
      where('weeklyEvent', '==', true)
    );
    
    const existingWeeklyEventsSnapshot = await getDocs(weeklyEventsQuery);
    const existingWeeklyEvents = existingWeeklyEventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Found ${existingWeeklyEvents.length} existing weekly events`);

    // Get active weekly event IDs from configuration
    const activeWeeklyEventIds = weeklyEvents
      .filter(event => event.active)
      .map(event => `weekly_${event.id}`);

    console.log('Active weekly event IDs:', activeWeeklyEventIds);

    // Remove weekly events that are no longer in the active configuration
    let eventsRemoved = 0;
    for (const existingEvent of existingWeeklyEvents) {
      if (!activeWeeklyEventIds.includes(existingEvent.weeklyEventId)) {
        console.log(`Removing obsolete weekly event: ${existingEvent.title} (ID: ${existingEvent.weeklyEventId})`);
        await deleteDoc(doc(db, 'events', existingEvent.id));
        eventsRemoved++;
      }
    }

    // Generate new events for active weekly events
    let eventsAdded = 0;
    let eventsSkipped = 0;
    let eventsUpdated = 0;

    // Date range: 3 months ago to 6 months in the future
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);

    for (const weeklyEvent of weeklyEvents.filter(e => e.active)) {
      const weeklyEventId = `weekly_${weeklyEvent.id}`;
      console.log(`Processing weekly event: ${weeklyEvent.title} (ID: ${weeklyEventId})`);
      
      // Get existing events for this specific weekly event
      const existingEventsForThisWeekly = existingWeeklyEvents.filter(
        event => event.weeklyEventId === weeklyEventId
      );

      // Generate events from start date to end date
      const current = new Date(startDate);
      
      while (current <= endDate) {
        // Find the next occurrence of the target day
        const dayDiff = (weeklyEvent.dayOfWeek - current.getDay() + 7) % 7;
        const eventDate = new Date(current);
        eventDate.setDate(eventDate.getDate() + dayDiff);
        
        if (eventDate <= endDate) {
          // Parse time and create full datetime
          const [hours, minutes] = weeklyEvent.startTime.split(':').map(Number);
          const [endHours, endMinutes] = weeklyEvent.endTime.split(':').map(Number);
          
          const startDateTime = new Date(eventDate);
          startDateTime.setHours(hours, minutes, 0, 0);
          
          const endDateTime = new Date(eventDate);
          endDateTime.setHours(endHours, endMinutes, 0, 0);

          // Check if this exact event already exists for this weekly event
          const existingEvent = existingEventsForThisWeekly.find(event => {
            const eventStart = new Date(event.start);
            return Math.abs(eventStart.getTime() - startDateTime.getTime()) < 60000; // Within 1 minute
          });

          if (existingEvent) {
            // Check if the existing event needs to be updated (color, title, location, etc.)
            const needsUpdate = 
              existingEvent.title !== weeklyEvent.title ||
              existingEvent.location !== (weeklyEvent.location || '') ||
              existingEvent.description !== (weeklyEvent.description || '') ||
              existingEvent.backgroundColor !== (weeklyEvent.backgroundColor || '#4CAF50') ||
              existingEvent.textColor !== (weeklyEvent.textColor || '#FFFFFF');

            if (needsUpdate) {
              console.log(`Updating existing event for ${weeklyEvent.title} on ${startDateTime.toLocaleDateString()}`);
              
              // Update the existing event
              const updateData = {
                title: weeklyEvent.title,
                location: weeklyEvent.location || '',
                description: weeklyEvent.description || '',
                backgroundColor: weeklyEvent.backgroundColor || '#4CAF50',
                textColor: weeklyEvent.textColor || '#FFFFFF',
                updatedAt: new Date().toISOString(),
                updatedBy: 'weekly-events-system'
              };

              await updateDoc(doc(db, 'events', existingEvent.id), updateData);
              eventsUpdated++;
            } else {
              console.log(`Event already exists and is up-to-date for ${weeklyEvent.title} on ${startDateTime.toLocaleDateString()}`);
              eventsSkipped++;
            }
          } else {
            // Create new event with weekly event metadata
            const newEvent = {
              title: weeklyEvent.title,
              start: startDateTime.toISOString(),
              end: endDateTime.toISOString(),
              location: weeklyEvent.location || '',
              description: weeklyEvent.description || '',
              backgroundColor: weeklyEvent.backgroundColor || '#4CAF50',
              textColor: weeklyEvent.textColor || '#FFFFFF',
              allDay: false,
              weeklyEvent: true, // Mark as weekly event
              weeklyEventId: weeklyEventId, // Link to configuration
              weeklyEventConfigId: weeklyEvent.id, // Original config ID
              createdAt: new Date().toISOString(),
              generatedBy: 'weekly-events-system'
            };

            await addDoc(eventsRef, newEvent);
            console.log(`Added weekly event: ${weeklyEvent.title} on ${startDateTime.toLocaleDateString()} at ${weeklyEvent.startTime}`);
            eventsAdded++;
          }
        }

        // Move to next week
        current.setDate(current.getDate() + 7);
      }
    }

    const message = `Weekly events processed successfully. Added: ${eventsAdded}, Updated: ${eventsUpdated}, Removed: ${eventsRemoved}, Skipped: ${eventsSkipped}`;
    console.log(message);

    res.status(200).json({
      message,
      eventsAdded,
      eventsUpdated,
      eventsRemoved,
      eventsSkipped,
      totalActiveWeeklyEvents: weeklyEvents.filter(e => e.active).length,
      processedWeeklyEvents: weeklyEvents.length
    });

  } catch (error) {
    console.error('Error generating weekly events:', error);
    res.status(500).json({ 
      error: 'Failed to generate weekly events',
      details: error.message 
    });
  }
}
