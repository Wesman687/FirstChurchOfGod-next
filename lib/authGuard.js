import { adminAuth } from './firebaseAdmin.js';

/**
 * Verify Firebase ID token and check admin permissions
 * @param {Request} request - The incoming request object
 * @returns {Promise<{ok: boolean, uid?: string, user?: any, status?: number, error?: string}>}
 */
export async function requireAdmin(request) {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth) {
      console.warn('Firebase Admin not available - admin authentication disabled');
      return { 
        ok: false, 
        status: 503, 
        error: 'Admin authentication service unavailable' 
      };
    }

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      return { 
        ok: false, 
        status: 401, 
        error: 'Missing authorization token' 
      };
    }

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Check if user is admin (either from custom claims or from your Firestore user document)
    const isAdmin = decodedToken.admin === true || 
                   decodedToken.isAdmin === true ||
                   (decodedToken.customClaims && decodedToken.customClaims.isAdmin === true);

    if (!isAdmin) {
      return { 
        ok: false, 
        status: 403, 
        error: 'Admin access required' 
      };
    }

    return { 
      ok: true, 
      uid: decodedToken.uid,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        isAdmin: true
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { 
      ok: false, 
      status: 401, 
      error: 'Invalid token' 
    };
  }
}

/**
 * Verify Firebase ID token (no admin check)
 * @param {Request} request - The incoming request object
 * @returns {Promise<{ok: boolean, uid?: string, user?: any, status?: number, error?: string}>}
 */
export async function requireAuth(request) {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth) {
      console.warn('Firebase Admin not available - authentication disabled');
      return { 
        ok: false, 
        status: 503, 
        error: 'Authentication service unavailable' 
      };
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      return { 
        ok: false, 
        status: 401, 
        error: 'Missing authorization token' 
      };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return { 
      ok: true, 
      uid: decodedToken.uid,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        isAdmin: decodedToken.admin === true || decodedToken.isAdmin === true
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { 
      ok: false, 
      status: 401, 
      error: 'Invalid token' 
    };
  }
}

/**
 * Middleware wrapper for API routes that require admin access
 */
export function withAdminAuth(handler) {
  return async function(req, res) {
    // Development mode bypass when Firebase Admin is not available
    if (!adminAuth && process.env.NODE_ENV === 'development') {
      console.warn('Development mode: Bypassing admin authentication (Firebase Admin not available)');
      // Create a mock user for development
      req.user = {
        uid: 'dev-user',
        email: 'dev@localhost',
        name: 'Development User',
        isAdmin: true
      };
      return handler(req, res);
    }

    const authResult = await requireAdmin(req);
    
    if (!authResult.ok) {
      return res.status(authResult.status).json({ 
        error: authResult.error 
      });
    }

    // Attach user info to request
    req.user = authResult.user;
    
    return handler(req, res);
  };
}

/**
 * Middleware wrapper for API routes that require authentication
 */
export function withAuth(handler) {
  return async function(req, res) {
    // Development mode bypass when Firebase Admin is not available
    if (!adminAuth && process.env.NODE_ENV === 'development') {
      console.warn('Development mode: Bypassing authentication (Firebase Admin not available)');
      // Create a mock user for development
      req.user = {
        uid: 'dev-user',
        email: 'dev@localhost',
        name: 'Development User',
        isAdmin: false
      };
      return handler(req, res);
    }

    const authResult = await requireAuth(req);
    
    if (!authResult.ok) {
      return res.status(authResult.status).json({ 
        error: authResult.error 
      });
    }

    // Attach user info to request
    req.user = authResult.user;
    
    return handler(req, res);
  };
}
