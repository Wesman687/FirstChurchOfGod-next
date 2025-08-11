import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let app;

try {
  // Check if app is already initialized
  if (getApps().length === 0) {
    // Check if we have the required environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID;
    
    if (!projectId) {
      console.warn('Firebase Admin: No project ID found, using client-side Firebase only');
      app = null;
    } else {
      // Check if we have service account credentials
      const hasServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || 
                               (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
      
      if (!hasServiceAccount) {
        console.log('Firebase Admin: No service account credentials found, using client-side Firebase only');
        app = null;
      } else {
        // Initialize with service account
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON 
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
          : {
              type: process.env.FIREBASE_TYPE || "service_account",
              project_id: projectId,
              private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
              private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
              client_email: process.env.FIREBASE_CLIENT_EMAIL,
              client_id: process.env.FIREBASE_CLIENT_ID,
              auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
              token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
              auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
              client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
            };

        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: projectId,
        });
        
        console.log('Firebase Admin: Successfully initialized with service account');
      }
    }
  } else {
    app = getApps()[0];
  }
} catch (error) {
  console.log('Firebase Admin: Could not initialize, falling back to client-side Firebase only');
  console.log('This is normal if you haven\'t set up service account credentials');
  app = null;
}

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;

export { app as firebaseAdmin };
