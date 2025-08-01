import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { link, desc, gallery, timeStamp, uploadedBy } = req.body;

      // Add image directly to gallery collection
      const docRef = await addDoc(collection(db, 'images'), {
        link,
        desc: desc || '',
        gallery: gallery || 'Events',
        timeStamp: timeStamp ? new Date(timeStamp) : new Date(),
        uploadedBy: uploadedBy || 'admin'
      });

      res.status(200).json({ 
        success: true, 
        id: docRef.id,
        message: 'Image added to gallery successfully' 
      });

    } catch (error) {
      console.error('Error adding image to gallery:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to add image to gallery' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
