// pages/api/pending-people-mentions.js
import { connectToMongo } from '@/server/lib/mongo';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const db = await connectToMongo('church');
    const pendingCollection = db.collection('pending_people_mentions');
    const approvedCollection = db.collection('people');

    if (req.method === 'GET') {
      // Get all pending people mentions for admin review
      const pendingMentions = await pendingCollection.find({}).sort({ date: -1 }).toArray();
      return res.status(200).json(pendingMentions);

    } else if (req.method === 'POST') {
      const { name, context, media_url, date, added_by, user_is_admin } = req.body;

      if (!name || !media_url) {
        return res.status(400).json({ error: 'name and media_url are required' });
      }

      if (user_is_admin) {
        // Admin submissions go directly to approved people mentions
        const mention = {
          name,
          context: context || '',
          start_time: null,
          end_time: null,
          mention_type: 'picture',
          media_url,
          date: date || new Date().toISOString(),
          approved: true,
          added_by: added_by || 'admin'
        };

        const result = await approvedCollection.insertOne(mention);
        return res.status(201).json({ 
          message: 'People mention added successfully', 
          id: result.insertedId,
          approved: true
        });
      } else {
        // Member submissions go to pending collection
        const pendingMention = {
          name,
          context: context || '',
          start_time: null,
          end_time: null,
          mention_type: 'picture',
          media_url,
          date: date || new Date().toISOString(),
          added_by: added_by || 'member',
          submitted_date: new Date().toISOString()
        };

        const result = await pendingCollection.insertOne(pendingMention);
        return res.status(201).json({ 
          message: 'People mention submitted for approval', 
          id: result.insertedId,
          approved: false
        });
      }

    } else if (req.method === 'PUT') {
      // Approve a pending mention
      const { id, action } = req.body;

      if (!id || !action) {
        return res.status(400).json({ error: 'id and action are required' });
      }

      if (action === 'approve') {
        // Get the pending mention
        const pendingMention = await pendingCollection.findOne({ _id: new ObjectId(id) });
        
        if (!pendingMention) {
          return res.status(404).json({ error: 'Pending mention not found' });
        }

        // Move to approved collection
        const approvedMention = {
          name: pendingMention.name,
          context: pendingMention.context,
          start_time: null,
          end_time: null,
          mention_type: 'picture',
          media_url: pendingMention.media_url,
          date: pendingMention.date,
          approved: true,
          added_by: pendingMention.added_by,
          approved_date: new Date().toISOString()
        };

        await approvedCollection.insertOne(approvedMention);
        await pendingCollection.deleteOne({ _id: new ObjectId(id) });

        return res.status(200).json({ message: 'Mention approved successfully' });

      } else if (action === 'reject') {
        // Just delete from pending
        const result = await pendingCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Pending mention not found' });
        }

        return res.status(200).json({ message: 'Mention rejected successfully' });
      } else {
        return res.status(400).json({ error: 'Invalid action. Use "approve" or "reject"' });
      }

    } else if (req.method === 'DELETE') {
      // Delete a pending mention (reject)
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'id is required' });
      }

      const result = await pendingCollection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Pending mention not found' });
      }

      return res.status(200).json({ message: 'Pending mention deleted successfully' });

    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
