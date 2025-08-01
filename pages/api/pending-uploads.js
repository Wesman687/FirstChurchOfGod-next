// pages/api/pending-uploads.js
import { connectToMongo } from '@/server/lib/mongo';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const db = await connectToMongo('church');
    const collection = db.collection('pending_uploads');

    if (req.method === 'POST') {
      const { imageUrl, description, peopleMentions, uploadedBy, uploadedAt } = req.body;

      if (!imageUrl || !uploadedBy) {
        return res.status(400).json({ error: 'imageUrl and uploadedBy are required' });
      }

      const pendingUpload = {
        imageUrl,
        description: description || '',
        peopleMentions: peopleMentions || [],
        uploadedBy,
        uploadedAt,
        status: 'pending',
        reviewedAt: null,
        reviewedBy: null
      };

      const result = await collection.insertOne(pendingUpload);
      return res.status(201).json({ 
        message: 'Upload submitted for approval', 
        id: result.insertedId 
      });

    } else if (req.method === 'GET') {
      // Get all pending uploads (admin only)
      const pendingUploads = await collection.find({ 
        status: 'pending' 
      }).sort({ uploadedAt: -1 }).toArray();
      
      return res.status(200).json(pendingUploads);

    } else if (req.method === 'PUT') {
      // Approve upload
      const { id, action } = req.body;

      if (!id || action !== 'approve') {
        return res.status(400).json({ error: 'id and action=approve are required' });
      }

      // Get the pending upload
      const pendingUpload = await collection.findOne({ _id: new ObjectId(id) });
      if (!pendingUpload) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      // Move image from pending to main images folder and add to gallery
      const { connectToMongo: connectToFirebase } = require('@/firebase');
      const { addDoc, collection: firestoreCollection } = require('firebase/firestore');
      const { ref, getDownloadURL, uploadString, deleteObject } = require('firebase/storage');
      const { storage, db: firedb } = require('@/firebase');

      try {
        // Add to Firestore gallery collection
        await addDoc(firestoreCollection(firedb, 'images'), {
          link: pendingUpload.imageUrl,
          desc: pendingUpload.description || '',
          gallery: 'Events', // Default gallery
          timeStamp: new Date(),
          uploadedBy: pendingUpload.uploadedBy.uid,
          approved: true,
          approvedBy: 'admin',
          approvedAt: new Date().toISOString()
        });

        // Add people mentions if any
        if (pendingUpload.peopleMentions && pendingUpload.peopleMentions.length > 0) {
          const mentionsDb = await connectToMongo('church');
          const mentionsCollection = mentionsDb.collection('people_mentions');
          
          const mentionPromises = pendingUpload.peopleMentions.map(mention =>
            mentionsCollection.insertOne({
              name: mention.name,
              context: mention.context || '',
              media_url: pendingUpload.imageUrl,
              date: new Date().toISOString(),
              approved: true,
              added_by: pendingUpload.uploadedBy.name || 'member'
            })
          );
          await Promise.all(mentionPromises);
        }

        // Remove from pending uploads
        await collection.deleteOne({ _id: new ObjectId(id) });

        return res.status(200).json({ message: 'Upload approved and added to gallery' });
      } catch (error) {
        console.error('Error approving upload:', error);
        return res.status(500).json({ error: 'Failed to approve upload' });
      }

    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'id is required' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      return res.status(200).json({ message: 'Upload rejected and deleted' });

    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
