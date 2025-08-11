// pages/api/forms/submissions/[formId].js
import { db } from '@/firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formId, userId } = req.query;

  if (!formId) {
    return res.status(400).json({ error: 'Form ID is required' });
  }

  try {
    // Verify form ownership
    const formDoc = await getDoc(doc(db, 'forms', formId));
    if (!formDoc.exists()) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (formDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get submissions for this form
    const submissionsRef = collection(db, 'form_submissions');
    const q = query(
      submissionsRef,
      where('formId', '==', formId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    res.status(200).json({ 
      submissions,
      total: submissions.length,
      formTitle: formDoc.data().title 
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
}
