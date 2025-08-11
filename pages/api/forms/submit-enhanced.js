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

// Enhanced email notification for advanced forms
async function sendAdvancedFormNotificationEmail(submission) {
  const { formData, formConfig, metadata } = submission;
  
  // Build form data HTML
  let formDataHtml = '<div style="margin: 20px 0;">';
  
  formConfig.fields?.forEach(field => {
    const value = formData[field.id];
    if (value !== undefined && value !== null && value !== '') {
      formDataHtml += `
        <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #3b82f6; background: #f8fafc;">
          <strong style="color: #1f2937;">${field.label}:</strong><br>
          <span style="color: #374151;">${Array.isArray(value) ? value.join(', ') : value}</span>
        </div>
      `;
    }
  });
  
  formDataHtml += '</div>';

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Form Submission</h1>
      </div>
      
      <div style="padding: 20px; background: white;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          ${formConfig.title || 'Form Submission'}
        </h2>
        
        ${formConfig.description ? `
          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #6b7280;">${formConfig.description}</p>
          </div>
        ` : ''}
        
        <h3 style="color: #374151;">Submission Details:</h3>
        ${formDataHtml}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            <strong>Submitted:</strong> ${new Date(metadata.timestamp).toLocaleString()}
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            <strong>Form ID:</strong> ${submission.formId}
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            <strong>Submission ID:</strong> ${submission._id}
          </p>
        </div>
      </div>
      
      <div style="background: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
        This email was automatically generated by the FirstChurchOfGod CMS Form System.
      </div>
    </div>
  `;

  const emailData = {
    to: process.env.FORM_NOTIFICATION_EMAIL || 'the1stchurchofgod@gmail.com',
    subject: `New Form Submission: ${formConfig.title || 'Contact Form'}`,
    html: emailHtml,
    text: `
New form submission received:

Form: ${formConfig.title || 'Contact Form'}
${formConfig.description ? `Description: ${formConfig.description}\n` : ''}

${formConfig.fields?.map(field => {
  const value = formData[field.id];
  return value ? `${field.label}: ${Array.isArray(value) ? value.join(', ') : value}` : null;
}).filter(Boolean).join('\n')}

Submitted: ${new Date(metadata.timestamp).toLocaleString()}
Form ID: ${submission.formId}
Submission ID: ${submission._id}
    `
  };

  return await sendEmail(emailData);
}

// Legacy email notification function
async function sendNotificationEmail(formType, data, submissionId) {
  try {
    // Try using the new enhanced email service first
    const emailData = {
      to: process.env.FORM_NOTIFICATION_EMAIL || 'the1stchurchofgod@gmail.com',
      subject: `New ${formType} submission from website`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New ${formType} Form Submission</h1>
          </div>
          
          <div style="padding: 20px; background: white;">
            <p><strong>Submission ID:</strong> ${submissionId}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            
            <h3>Form Data:</h3>
            <div style="margin: 20px 0;">
              ${Object.entries(data).map(([key, value]) => `
                <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #3b82f6; background: #f8fafc;">
                  <strong style="color: #1f2937;">${key}:</strong><br>
                  <span style="color: #374151;">${value}</span>
                </div>
              `).join('')}
            </div>
            
            <p>Please review this submission in the admin panel.</p>
          </div>
          
          <div style="background: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            This email was automatically generated by the FirstChurchOfGod CMS.
          </div>
        </div>
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

    try {
      await sendEmail(emailData);
      console.log('✅ Enhanced notification email sent successfully');
      return true;
    } catch (enhancedError) {
      console.log('📧 Enhanced email failed, trying legacy method...', enhancedError.message);
      
      // Fallback to legacy church email API
      const churchEmailAPI = process.env.EMAIL_API_URL;
      
      if (!churchEmailAPI) {
        console.log('📧 No email API configured, skipping email notification');
        return false;
      }

      const churchEmail = process.env.CHURCH_EMAIL || 'the1stchurchofgod@gmail.com';
      
      const legacyEmailData = {
        to: churchEmail,
        subject: `New ${formType} submission from website`,
        html: emailData.html,
        text: emailData.text
      };

      const response = await fetch(churchEmailAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(legacyEmailData)
      });

      if (response.ok) {
        console.log('✅ Legacy notification email sent successfully');
        return true;
      } else {
        const errorData = await response.text();
        console.error('❌ Failed to send notification email:', errorData);
        return false;
      }
    }
  } catch (error) {
    console.error('🔥 Email notification error:', error);
    return false;
  }
}
