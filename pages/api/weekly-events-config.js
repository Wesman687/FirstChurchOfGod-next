import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('GET request for weekly events config');
      
      const configDoc = await getDoc(doc(db, 'config', 'weeklyEvents'));
      
      if (configDoc.exists()) {
        console.log('Config document exists:', configDoc.data());
        res.status(200).json(configDoc.data());
      } else {
        console.log('No config document found, returning empty');
        res.status(200).json({ weeklyEvents: null });
      }
    } catch (error) {
      console.error('Error fetching weekly events config:', error);
      res.status(500).json({ error: 'Failed to fetch weekly events configuration', details: error.message });
    }
  } 
  else if (req.method === 'POST') {
    try {
      console.log('POST request for weekly events config');
      
      const { weeklyEvents } = req.body;
      console.log('Received weekly events:', weeklyEvents);
      
      if (!weeklyEvents || !Array.isArray(weeklyEvents)) {
        return res.status(400).json({ error: 'Invalid weekly events data' });
      }

      // Validate each event has required fields
      for (const event of weeklyEvents) {
        if (!event.title || typeof event.dayOfWeek !== 'number' || !event.startTime || !event.endTime) {
          return res.status(400).json({ error: 'Each event must have title, dayOfWeek, startTime, and endTime' });
        }
      }

      // Save to Firestore using the same pattern as other APIs
      const configData = { 
        weeklyEvents,
        lastUpdated: new Date().toISOString()
      };
      
      console.log('Saving config data:', configData);
      await setDoc(doc(db, 'config', 'weeklyEvents'), configData);
      console.log('Config saved successfully');

      res.status(200).json({ 
        message: 'Weekly events configuration saved successfully',
        weeklyEvents 
      });
    } catch (error) {
      console.error('Error saving weekly events config:', error);
      res.status(500).json({ error: 'Failed to save weekly events configuration', details: error.message });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
