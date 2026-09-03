import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = getFirestore();

async function updateSettings() {
  console.log(`Updating settings in ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}...`);
  await db.collection('settings').doc('company').update({
    companyAddress: 'Ashok Nagar, bagdogra P.O - bagdogra, Dist. - Darjeeling - 734014',
    address: 'Ashok Nagar, bagdogra P.O - bagdogra, Dist. - Darjeeling - 734014',
    phone: '+91 9851544861',
    whatsappNumber: '+91 9851544861'
  });
  console.log('✅ Settings updated successfully in live Firestore!');
  process.exit(0);
}

updateSettings().catch((e) => {
  console.error('❌ Update error:', e);
  process.exit(1);
});
