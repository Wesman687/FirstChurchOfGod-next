import dbConnect from '../../../lib/db';
import { requireAuth } from '../../../lib/authGuard';
import { sendEmail } from '../../../lib/emailService';

// Enhanced form submission model for MongoDB
const FormSubmission = {
  async create(data) {
    const { db } = await dbConnect();
    const result = await db.collection('form_submissions').insertOne({
      ...data,
      createdAt: new Date(),
      status: 'pending'
    });
    return { _id: result.insertedId, ...data };
  },

  async findAll(query = {}) {
    const { db } = await dbConnect();
    return db.collection('form_submissions').find(query).sort({ createdAt: -1 }).toArray();
  },

  async findByFormId(formId) {
    const { db } = await dbConnect();
    return db.collection('form_submissions').find({ formId }).sort({ createdAt: -1 }).toArray();
  }
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { 
        formType, 
        data, 
        pageSlug, 
        metadata,
        // New advanced form builder fields
        formId,
        formConfig,
        userInfo
      } = req.body;

      // Support both legacy and new form submission formats
      const isAdvancedForm = formId && formConfig;
      
      if (!formType && !formId) {
        return res.status(400).json({
          error: 'validation_failed',
          message: 'Form type or form ID is required'
        });
      }

      if (!data) {
        return res.status(400).json({
          error: 'validation_failed',
          message: 'Form data is required'
        });
      }

      // Create submission record
      const submissionData = isAdvancedForm ? {
        formId,
        formType: formConfig.title || 'Custom Form',
        formData: data,
        formConfig,
        userInfo: userInfo || {},
        pageSlug: pageSlug || 'cms-form',
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          isAdvancedForm: true,
          ...metadata
        }
      } : {
        formType,
        data,
        pageSlug: pageSlug || 'unknown',
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          isAdvancedForm: false,
          ...metadata
        }
      };

      const submission = await FormSubmission.create(submissionData);

      // Send email notification
      try {
        if (isAdvancedForm) {
          await sendAdvancedFormNotificationEmail(submission);
        } else {
          await sendNotificationEmail(formType, data, submission._id);
        }
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the submission if email fails
      }

      // Determine success message and redirect
      const successMessage = isAdvancedForm 
        ? (formConfig.settings?.successMessage || 'Thank you for your submission!')
        : 'Form submitted successfully';
      
      const redirectUrl = isAdvancedForm 
        ? formConfig.settings?.redirectUrl 
        : null;

      res.status(201).json({
        success: true,
        submissionId: submission._id,
        message: successMessage,
        redirectUrl
      });

    } catch (error) {
      console.error('Form submission error:', error);
      res.status(500).json({
        error: 'submission_failed',
        message: 'Failed to process form submission'
      });
    }
  } else if (req.method === 'GET') {
    // Admin only - get form submissions
    try {
      await requireAuth(req, res);
      const { formId } = req.query;
      
      const submissions = formId 
        ? await FormSubmission.findByFormId(formId)
        : await FormSubmission.findAll();
        
      res.status(200).json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// Basic email notification function
async function sendNotificationEmail(formType, data, submissionId) {
  try {
    const churchEmailAPI = process.env.NEXT_PUBLIC_EMAIL_API;
    
    if (!churchEmailAPI) {
      console.log('📧 Email API not configured, skipping email notification');
      return false;
    }

    const churchEmail = process.env.CHURCH_EMAIL || 'the1stchurchofgod@gmail.com';
    
    // Prepare email data for your church server
    const emailData = {
      to: churchEmail,
      subject: `New ${formType} submission from website`,
      html: `
        <h2>New ${formType} Form Submission</h2>
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        
        <h3>Form Data:</h3>
        <ul>
          ${Object.entries(data).map(([key, value]) => 
            `<li><strong>${key}:</strong> ${value}</li>`
          ).join('')}
        </ul>
        
        <p>Please review this submission in the admin panel.</p>
      `,
      text: `
        New ${formType} form submission
        
        Submission ID: ${submissionId}
        Submitted: ${new Date().toLocaleString()}
        
        Form Data:
        ${Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')}
        
        Please review this submission in the admin panel.
      `
    };

    // Send via your church server API
    const response = await fetch(churchEmailAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      console.log('✅ Notification email sent successfully');
      return true;
    } else {
      const errorData = await response.text();
      console.error('❌ Failed to send notification email:', errorData);
      return false;
    }
  } catch (error) {
    console.error('🔥 Email notification error:', error);
    return false;
  }
}
