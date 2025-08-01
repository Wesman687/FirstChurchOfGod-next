// pages/api/unapproved-mentions.js
import { connectToMongo } from '@/server/lib/mongo';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await connectToMongo('church');
    const collection = db.collection('people');
    
    // Get only truly unapproved mentions
    const unapprovedMentions = await collection.find({ 
      mention_type: 'picture',
      approved: { $ne: true }  // Not equal to true (includes false and missing)
    }).sort({ date: -1 }).toArray();
    
    console.log('Found unapproved mentions:', unapprovedMentions.length);
    console.log('Sample mention:', unapprovedMentions[0]);
    
    return res.status(200).json(unapprovedMentions);
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
