// lib/emailService.js
/**
 * Email service utility that uses the existing /api/send-email.js endpoint
 */

export const sendFormNotification = async ({
  formTitle,
  submissionData,
  formId,
  submissionId,
  notificationEmails = []
}) => {
  try {
    // Format the submission data for email
    const fieldsList = Object.entries(submissionData)
      .map(([fieldName, value]) => `<li><strong>${fieldName}:</strong> ${value}</li>`)
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Form Submission: ${formTitle}
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Submission Details</h3>
          <ul style="line-height: 1.6;">
            ${fieldsList}
          </ul>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6;">
          <p style="margin: 0;"><strong>Form ID:</strong> ${formId}</p>
          <p style="margin: 5px 0 0 0;"><strong>Submission ID:</strong> ${submissionId}</p>
          <p style="margin: 5px 0 0 0;"><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/forms/${formId}/submissions" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Admin Panel
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          This is an automated notification from your website's form system.
        </p>
      </div>
    `;

    const textContent = `
New Form Submission: ${formTitle}

Submission Details:
${Object.entries(submissionData)
  .map(([fieldName, value]) => `${fieldName}: ${value}`)
  .join('\n')}

Form ID: ${formId}
Submission ID: ${submissionId}
Submitted At: ${new Date().toLocaleString()}

View in Admin Panel: ${process.env.NEXT_PUBLIC_BASE_URL}/admin/forms/${formId}/submissions
    `;

    // Send to each notification email
    const emailPromises = notificationEmails.map(email => 
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: `New Submission: ${formTitle}`,
          html: htmlContent,
          text: textContent,
        }),
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    // Check if any emails failed
    const failedEmails = results
      .map((result, index) => ({ result, email: notificationEmails[index] }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ email }) => email);

    if (failedEmails.length > 0) {
      console.warn('Some notification emails failed to send:', failedEmails);
    }

    return {
      success: true,
      sentTo: notificationEmails.length - failedEmails.length,
      failed: failedEmails.length,
      failedEmails,
    };

  } catch (error) {
    console.error('Error sending form notification:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const sendFormConfirmation = async ({
  recipientEmail,
  recipientName,
  formTitle,
  submissionData,
  customMessage = ''
}) => {
  try {
    const fieldsList = Object.entries(submissionData)
      .map(([fieldName, value]) => `<li><strong>${fieldName}:</strong> ${value}</li>`)
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          Thank You for Your Submission!
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Dear ${recipientName || 'Friend'},
        </p>
        
        <p style="line-height: 1.6;">
          Thank you for submitting the <strong>${formTitle}</strong> form. We have received your information and will get back to you soon.
        </p>
        
        ${customMessage ? `
          <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; line-height: 1.6;">${customMessage}</p>
          </div>
        ` : ''}
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Your Submission</h3>
          <ul style="line-height: 1.6;">
            ${fieldsList}
          </ul>
        </div>
        
        <p style="line-height: 1.6;">
          If you have any questions or need to make changes, please don't hesitate to contact us.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280;">
            Blessings,<br>
            <strong>First Church of God Team</strong>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          This is an automated confirmation email.
        </p>
      </div>
    `;

    const textContent = `
Thank You for Your Submission!

Dear ${recipientName || 'Friend'},

Thank you for submitting the ${formTitle} form. We have received your information and will get back to you soon.

${customMessage ? `\n${customMessage}\n` : ''}

Your Submission:
${Object.entries(submissionData)
  .map(([fieldName, value]) => `${fieldName}: ${value}`)
  .join('\n')}

If you have any questions or need to make changes, please don't hesitate to contact us.

Blessings,
First Church of God Team
    `;

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipientEmail,
        subject: `Confirmation: ${formTitle}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send confirmation email');
    }

    return {
      success: true,
      sentTo: recipientEmail,
    };

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const sendWelcomeEmail = async ({ recipientEmail, recipientName }) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          Welcome to First Church of God!
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Dear ${recipientName || 'Friend'},
        </p>
        
        <p style="line-height: 1.6;">
          Welcome to our church family! We're excited to have you join us on this spiritual journey.
        </p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">What's Next?</h3>
          <ul style="line-height: 1.8;">
            <li>Join us for Sunday worship service</li>
            <li>Connect with our community groups</li>
            <li>Explore our ministries and programs</li>
            <li>Get involved in volunteer opportunities</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Visit Our Website
          </a>
        </div>
        
        <p style="line-height: 1.6;">
          If you have any questions, please don't hesitate to reach out to us.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280;">
            Blessings,<br>
            <strong>Pastor and the First Church of God Team</strong>
          </p>
        </div>
      </div>
    `;

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipientEmail,
        subject: 'Welcome to First Church of God!',
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send welcome email');
    }

    return {
      success: true,
      sentTo: recipientEmail,
    };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generic sendEmail function for backwards compatibility
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API responded with status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      result,
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
