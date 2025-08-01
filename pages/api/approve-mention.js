// pages/api/approve-mention.js
import { connectToMongo } from '@/server/lib/mongo';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.body;
  console.log('Approve mention API called with ID:', id);

  if (!id) {
    console.log('No ID provided');
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    const db = await connectToMongo('church');
    console.log('Connected to database, updating mention with ID:', id);
    
    const result = await db.collection('people').updateOne(
      { _id: new ObjectId(id) },
      { $set: { approved: true } }
    );
    
    console.log('Update result:', result);
    
    if (result.matchedCount === 0) {
      console.log('No mention found with ID:', id);
      return res.status(404).json({ error: 'Mention not found' });
    }
    
    console.log('Mention approved successfully');
    res.status(200).json({ message: 'Approved successfully' });
  } catch (error) {
    console.error('Error in approve-mention API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}