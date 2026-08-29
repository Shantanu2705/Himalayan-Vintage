import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  initialVehicles,
  initialDrivers,
  initialCorporateClients,
  initialEnquiries,
  initialBookings,
  initialQuotations,
  initialRoutes,
  initialDestinations,
  initialPermits,
  initialSightseeings,
  initialInclusions,
  initialExclusions,
  initialNotifications,
  initialSettings,
} from '../lib/firebase/seed-data';

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

if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'himalayanvintage') {
  console.error('❌ SAFETY LOCK: You are trying to wipe/seed the LIVE production database!');
  console.error('If you really mean to do this, temporarily change the safety lock in scripts/seed-admin.ts');
  process.exit(1);
}

async function runSeed() {
  console.log(`🚀 Starting Admin SDK live database seed for ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}...`);
  let count = 0;

  for (const v of initialVehicles) { await db.collection('vehicles').doc(v.id).set(v); count++; }
  for (const d of initialDrivers) { await db.collection('drivers').doc(d.id).set(d); count++; }
  for (const c of initialCorporateClients) { await db.collection('corporate').doc(c.id).set(c); count++; }
  for (const e of initialEnquiries) { await db.collection('enquiries').doc(e.id).set(e); count++; }
  for (const b of initialBookings) { await db.collection('bookings').doc(b.id).set(b); count++; }
  for (const q of initialQuotations) { await db.collection('quotations').doc(q.id).set(q); count++; }
  for (const r of initialRoutes) { await db.collection('routes').doc(r.id).set(r); count++; }
  for (const dest of initialDestinations) { await db.collection('destinations').doc(dest.id).set(dest); count++; }
  for (const p of initialPermits) { await db.collection('permits').doc(p.id).set(p); count++; }
  for (const s of initialSightseeings) { await db.collection('sightseeings').doc(s.id).set(s); count++; }
  for (const inc of initialInclusions) { await db.collection('inclusions').doc(inc.id).set(inc); count++; }
  for (const exc of initialExclusions) { await db.collection('exclusions').doc(exc.id).set(exc); count++; }
  for (const notif of initialNotifications) { await db.collection('notifications').doc(notif.id).set(notif); count++; }
  await db.collection('settings').doc('company').set(initialSettings); count++;

  console.log(`✅ Successfully uploaded ${count} enterprise documents to live Firestore!`);
  process.exit(0);
}

runSeed().catch((e) => {
  console.error('❌ Seeding error:', e);
  process.exit(1);
});
