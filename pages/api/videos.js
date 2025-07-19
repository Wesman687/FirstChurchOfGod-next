import { connectToMongo } from '@/server/lib/mongo';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { search = '', location = '', sort = 'recent' } = req.query;

  try {
    const db = await connectToMongo('church');
    const collection = db.collection('sermons');

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = location;
    }

    const sortOptions = {
      recent: { uploaded_at: -1 },
      popular: { views: -1 },
      title: { title: 1 }
    };

    const videos = await collection
      .find(query)
      .sort(sortOptions[sort] || sortOptions.recent)
      .toArray();

    res.status(200).json(videos);
  } catch (error) {
    console.error('Video fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
