import * as admin from 'firebase-admin';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  // Verificar que las variables de entorno existan
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.error('⚠️  Firebase Admin SDK not configured. Please set environment variables:');
    console.error('   - FIREBASE_PROJECT_ID');
    console.error('   - FIREBASE_CLIENT_EMAIL');
    console.error('   - FIREBASE_PRIVATE_KEY');
    console.error('   See .env.local.example for details.');
  } else {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
