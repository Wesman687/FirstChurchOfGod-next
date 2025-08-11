// pages/api/upload/list.js
import { db } from '@/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get user's images from Firestore
    const imagesRef = collection(db, `users/${userId}/images`);
    const q = query(imagesRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    res.status(200).json({ images });

  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}
