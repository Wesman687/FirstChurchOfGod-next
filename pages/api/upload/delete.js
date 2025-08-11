// pages/api/upload/delete.js
import { db, storage } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, imageId, storagePath } = req.body;
    
    if (!userId || !imageId || !storagePath) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Delete from Firestore
    await deleteDoc(doc(db, `users/${userId}/images`, imageId));

    // Delete from Storage
    const imageRef = ref(storage, storagePath);
    await deleteObject(imageRef);

    // Try to delete thumbnail too
    try {
      const thumbnailPath = storagePath.replace('/images/', '/images/').replace(/([^/]+)$/, 'thumbnails/thumb_$1');
      const thumbnailRef = ref(storage, thumbnailPath);
      await deleteObject(thumbnailRef);
    } catch (thumbError) {
      console.warn('Thumbnail deletion failed:', thumbError);
    }

    res.status(200).json({ success: true, message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}
