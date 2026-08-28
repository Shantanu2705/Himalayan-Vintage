import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  type: 'service_account',
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

async function deleteCollection(collectionPath: string, batchSize: number = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise<void>((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(query: any, resolve: any) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

async function wipeDatabase() {
  console.log('🚀 Starting wipe of live Firestore Database...');
  const collections = [
    'vehicles', 'drivers', 'corporate', 'enquiries', 
    'bookings', 'quotations', 'routes', 'destinations', 
    'permits', 'sightseeings', 'inclusions', 'exclusions', 
    'notifications', 'invoices', 'receipts'
  ];

  for (const coll of collections) {
    console.log(`Wiping collection: ${coll}...`);
    await deleteCollection(coll);
  }

  console.log('✅ Successfully wiped all dummy data collections from live Firestore!');
  process.exit(0);
}

wipeDatabase().catch((e) => {
  console.error('❌ Wipe error:', e);
  process.exit(1);
});
