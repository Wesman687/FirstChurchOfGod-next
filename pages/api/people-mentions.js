// pages/api/people-mentions.js
import { connectToMongo } from '@/server/lib/mongo';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { video_id } = req.query;

  if (!video_id) {
    return res.status(400).json({ error: 'video_id is required' });
  }

  try {
    const db = await connectToMongo('church');
    const mentions = await db.collection('people').find({ video_id }).toArray();
    res.status(200).json(mentions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}