// pages/api/sermons.js
import { connectToMongo } from '@/server/lib/mongo';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await connectToMongo('church');
    const sermons = await db.collection('sermons').find({}).toArray();
    res.status(200).json(sermons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}