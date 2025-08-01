// pages/api/people-names.js
import { connectToMongo } from '@/server/lib/mongo';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await connectToMongo('church');
    const collection = db.collection('people');
    
    // Get distinct names from people mentions
    const names = await collection.distinct('name');
    
    // Also get names from users collection if you want to include registered members
    const userCollection = db.collection('user');
    const users = await userCollection.find({}, { 
      projection: { firstName: 1, lastName: 1 } 
    }).toArray();
    
    const userNames = users.map(user => `${user.firstName} ${user.lastName}`);
    
    // Combine and deduplicate names
    const allNames = [...new Set([...names, ...userNames])].filter(Boolean).sort();
    
    return res.status(200).json(allNames);
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
