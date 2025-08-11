// pages/api/forms/[id].js
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Form ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get form by ID
        const formDoc = await getDoc(doc(db, 'forms', id));
        
        if (!formDoc.exists()) {
          return res.status(404).json({ error: 'Form not found' });
        }

        const formData = {
          id: formDoc.id,
          ...formDoc.data(),
          createdAt: formDoc.data().createdAt?.toDate?.()?.toISOString(),
          updatedAt: formDoc.data().updatedAt?.toDate?.()?.toISOString(),
        };

        res.status(200).json({ form: formData });
        break;

      case 'PUT':
        // Update form
        const updateData = {
          ...req.body,
          updatedAt: serverTimestamp()
        };

        // Remove fields that shouldn't be updated
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.submissionCount;

        await updateDoc(doc(db, 'forms', id), updateData);

        res.status(200).json({
          success: true,
          message: 'Form updated successfully'
        });
        break;

      case 'DELETE':
        // Delete form
        const { userId } = req.body;
        
        // Verify ownership
        const deleteFormDoc = await getDoc(doc(db, 'forms', id));
        if (!deleteFormDoc.exists()) {
          return res.status(404).json({ error: 'Form not found' });
        }

        if (deleteFormDoc.data().userId !== userId) {
          return res.status(403).json({ error: 'Unauthorized' });
        }

        await deleteDoc(doc(db, 'forms', id));

        res.status(200).json({
          success: true,
          message: 'Form deleted successfully'
        });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Form API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
