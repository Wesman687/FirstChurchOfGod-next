// pages/api/image-people-mentions.js
import { connectToMongo } from '@/server/lib/mongo';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const db = await connectToMongo('church');
    const collection = db.collection('people');

    if (req.method === 'GET') {
      const { media_url, search } = req.query;

      if (search) {
        // Search for people mentions by name
        const mentions = await collection.find({ 
          name: { $regex: search, $options: 'i' },
          mention_type: 'picture'
        }).toArray();
        
        return res.status(200).json(mentions);
      }

      if (!media_url) {
        return res.status(400).json({ error: 'media_url or search query is required' });
      }

      const mentions = await collection.find({ 
        media_url,
        mention_type: 'picture'
      }).toArray();
      
      return res.status(200).json(mentions);

    } else if (req.method === 'POST') {
      const { name, context, media_url, date, approved, added_by } = req.body;

      if (!name || !media_url) {
        return res.status(400).json({ error: 'name and media_url are required' });
      }

      const mention = {
        name,
        context: context || '',
        start_time: null,
        end_time: null,
        mention_type: 'picture',
        media_url,
        date: date || new Date().toISOString(),
        approved: approved !== undefined ? approved : false,
        added_by: added_by || 'unknown'
      };

      const result = await collection.insertOne(mention);
      return res.status(201).json({ 
        message: 'People mention created successfully', 
        id: result.insertedId 
      });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'id is required' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Mention not found' });
      }

      return res.status(200).json({ message: 'Mention deleted successfully' });

    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
