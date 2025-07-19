// pages/api/approve-mention.js
import { connectToMongo } from '@/server/lib/mongo';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    const db = await connectToMongo('church');
    const result = await db.collection('people').updateOne(
      { _id: new ObjectId(id) },
      { $set: { approved: true } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Mention not found' });
    }
    res.status(200).json({ message: 'Approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}