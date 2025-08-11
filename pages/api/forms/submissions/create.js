// pages/api/forms/submissions/create.js
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formId, data, userInfo } = req.body;

    if (!formId || !data) {
      return res.status(400).json({ error: 'Form ID and data are required' });
    }

    // Create submission document
    const submissionData = {
      formId,
      data,
      submittedAt: serverTimestamp(),
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      ...userInfo
    };

    const docRef = await addDoc(collection(db, 'form_submissions'), submissionData);

    // Increment submission count on form
    await updateDoc(doc(db, 'forms', formId), {
      submissionCount: increment(1),
      lastSubmission: serverTimestamp()
    });

    res.status(201).json({
      success: true,
      submissionId: docRef.id,
      message: 'Form submitted successfully'
    });

  } catch (error) {
    console.error('Submit form error:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
}
