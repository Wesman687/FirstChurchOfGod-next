// pages/api/forms/create.js
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userId,
      title,
      description,
      fields,
      settings,
      styling
    } = req.body;

    if (!userId || !title || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create form document
    const formData = {
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      fields,
      settings: {
        submitMessage: settings?.submitMessage || 'Thank you for your submission!',
        redirectUrl: settings?.redirectUrl || '',
        emailNotifications: settings?.emailNotifications || [],
        allowMultiple: settings?.allowMultiple !== false,
        captcha: settings?.captcha || false,
        isActive: settings?.isActive !== false,
        ...settings
      },
      styling: {
        backgroundColor: styling?.backgroundColor || '#ffffff',
        textColor: styling?.textColor || '#333333',
        buttonColor: styling?.buttonColor || '#3b82f6',
        borderRadius: styling?.borderRadius || '8px',
        fontFamily: styling?.fontFamily || 'inherit',
        ...styling
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      submissionCount: 0
    };

    const docRef = await addDoc(collection(db, 'forms'), formData);

    res.status(201).json({
      success: true,
      formId: docRef.id,
      message: 'Form created successfully'
    });

  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
}
