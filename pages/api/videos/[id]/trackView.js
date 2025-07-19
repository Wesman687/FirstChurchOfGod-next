import { connectToMongo } from '@/server/lib/mongo';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await connectToMongo('church');
    const { id } = req.query;

    const result = await db.collection('sermons').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to track view' });
  }
}