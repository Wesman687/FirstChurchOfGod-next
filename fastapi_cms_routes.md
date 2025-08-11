# FastAPI Routes for CMS Integration

## Overview
These routes need to be implemented on the church-server FastAPI backend to support the lightweight CMS functionality, particularly for form submissions and data processing that may require server-side logic.

## Base URL
```
https://your-church-server.com/api/v1
```

## Authentication
All routes should expect Firebase ID tokens in the `Authorization: Bearer <token>` header.

---

## 1. Form Submission Routes

### POST /cms/forms/contact
Handle contact form submissions from CMS pages.

**Request Body:**
```json
{
  "formId": "contact-form-123",
  "pageSlug": "contact",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0123",
    "message": "Hello from the website",
    "subject": "General Inquiry"
  },
  "metadata": {
    "timestamp": "2025-08-08T12:00:00Z",
    "userAgent": "Mozilla/5.0...",
    "ip": "192.168.1.1"
  }
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": "sub_123456789",
  "message": "Form submitted successfully"
}
```

### POST /cms/forms/prayer-request
Handle prayer request submissions from CMS pages.

**Request Body:**
```json
{
  "formId": "prayer-request-form",
  "pageSlug": "prayer",
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "request": "Please pray for my family during this difficult time",
    "anonymous": false,
    "publicShare": true
  }
}
```

### POST /cms/forms/ministry-signup
Handle ministry signup forms from CMS pages.

**Request Body:**
```json
{
  "formId": "ministry-signup-123",
  "pageSlug": "ministries/youth",
  "data": {
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "phone": "555-0456",
    "ministry": "Youth Ministry",
    "role": "Volunteer",
    "availability": ["Sunday", "Wednesday"],
    "experience": "2 years working with youth"
  }
}
```

### POST /cms/forms/event-registration
Handle event registration from CMS pages.

**Request Body:**
```json
{
  "formId": "event-registration-456",
  "pageSlug": "events/summer-camp",
  "data": {
    "participantName": "Sarah Wilson",
    "parentEmail": "parent@example.com",
    "age": 12,
    "emergencyContact": {
      "name": "Mike Wilson",
      "phone": "555-0789"
    },
    "medicalInfo": "No allergies",
    "eventId": "summer-camp-2025"
  }
}
```

---

## 2. CMS Admin Routes

### GET /cms/analytics/forms
Get form submission analytics for admin dashboard.

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `formType`: Optional filter by form type

**Response:**
```json
{
  "totalSubmissions": 150,
  "byFormType": {
    "contact": 45,
    "prayer-request": 65,
    "ministry-signup": 25,
    "event-registration": 15
  },
  "recentSubmissions": [
    {
      "id": "sub_123",
      "formType": "contact",
      "timestamp": "2025-08-08T12:00:00Z",
      "status": "processed"
    }
  ]
}
```

### GET /cms/submissions/{submissionId}
Get details of a specific form submission.

**Response:**
```json
{
  "id": "sub_123456789",
  "formId": "contact-form-123",
  "pageSlug": "contact",
  "data": { /* form data */ },
  "status": "processed",
  "createdAt": "2025-08-08T12:00:00Z",
  "processedAt": "2025-08-08T12:05:00Z",
  "notifications": {
    "emailSent": true,
    "adminNotified": true
  }
}
```

### PUT /cms/submissions/{submissionId}/status
Update submission status (for admin workflow).

**Request Body:**
```json
{
  "status": "processed|pending|archived",
  "notes": "Followed up with applicant"
}
```

---

## 3. Email & Notification Routes

### POST /cms/notifications/send
Send notifications based on form submissions.

**Request Body:**
```json
{
  "type": "form_submission",
  "formType": "contact",
  "recipients": ["admin@church.com"],
  "data": {
    "submissionId": "sub_123",
    "formData": { /* form data */ }
  },
  "template": "contact_form_notification"
}
```

### POST /cms/email/autoresponder
Send automated responses to form submitters.

**Request Body:**
```json
{
  "to": "user@example.com",
  "template": "contact_form_confirmation",
  "data": {
    "name": "John Doe",
    "submissionId": "sub_123"
  }
}
```

---

## 4. Data Integration Routes

### POST /cms/sync/member-data
Sync form data with existing member database.

**Request Body:**
```json
{
  "submissionId": "sub_123",
  "email": "member@church.com",
  "action": "create|update|link",
  "data": { /* member data to sync */ }
}
```

### GET /cms/lookup/member
Look up existing member data for form pre-population.

**Query Parameters:**
- `email`: Member email address

**Response:**
```json
{
  "found": true,
  "member": {
    "name": "John Doe",
    "email": "john@church.com",
    "phone": "555-0123",
    "memberSince": "2020-01-01"
  }
}
```

---

## 5. File Processing Routes

### POST /cms/files/process
Process uploaded files from CMS forms.

**Request Body:**
```json
{
  "submissionId": "sub_123",
  "files": [
    {
      "filename": "application.pdf",
      "url": "https://firestore.url/file.pdf",
      "type": "application/pdf",
      "size": 1024000
    }
  ],
  "action": "scan|archive|forward"
}
```

---

## 6. Webhook Routes

### POST /cms/webhooks/form-submitted
Webhook endpoint for real-time form processing.

**Request Body:**
```json
{
  "event": "form.submitted",
  "formId": "contact-form-123",
  "submissionId": "sub_123",
  "timestamp": "2025-08-08T12:00:00Z"
}
```

---

## Implementation Notes

1. **Authentication**: All routes should verify Firebase ID tokens and check admin permissions where appropriate.

2. **Rate Limiting**: Implement rate limiting for public form submissions (e.g., 5 submissions per IP per hour).

3. **Validation**: Use Pydantic models for request/response validation.

4. **Error Handling**: Return consistent error format:
   ```json
   {
     "error": "validation_failed",
     "message": "Email is required",
     "details": { "field": "email", "code": "required" }
   }
   ```5. **Logging**: Log all form submissions and admin actions for audit trail.

6. **Database**: Store submissions in MongoDB `cms_submissions` collection with proper indexing.

7. **Background Jobs**: Use Celery or similar for email sending and file processing (optional).

8. **Security**: Sanitize all input data and implement CSRF protection for admin routes.

---

## Environment Variables

```env
# FastAPI CMS Configuration
MONGODB_URI=mongodb://localhost:27017/churchdb
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/churchdb

# Church Email Configuration
CHURCH_EMAIL=the1stchurchofgod@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=the1stchurchofgod@gmail.com
SMTP_PASSWORD=your-app-password

# CMS Configuration
CMS_ADMIN_EMAILS=the1stchurchofgod@gmail.com,admin@church.com
CMS_FILE_UPLOAD_MAX_SIZE=10MB
CMS_RATE_LIMIT_SUBMISSIONS=5

# Optional: Redis for caching and sessions (not required for basic functionality)
# REDIS_URL=redis://localhost:6379
```
