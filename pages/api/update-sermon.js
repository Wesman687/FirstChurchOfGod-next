// pages/api/update-sermon.js (for editing)
import { connectToMongo } from '@/server/lib/mongo';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const updatedSermon = req.body;

  if (!updatedSermon._id) {
    return res.status(400).json({ error: '_id is required' });
  }

  try {
    const db = await connectToMongo('church');
    const result = await db.collection('sermons').updateOne(
      { _id: new ObjectId(updatedSermon._id) },
      { $set: updatedSermon }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    res.status(200).json({ message: 'Updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}