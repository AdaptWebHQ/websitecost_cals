import * as dotenv from 'dotenv';
dotenv.config();

console.log('Env variables check:');
console.log('- PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('- CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('- PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);

import { adminDb } from '../src/firebase/admin';
import { COLLECTIONS } from '../src/constants';

async function checkDb() {
  console.log('Fetching package features...');
  const snap = await adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).get();
  console.log(`Total package features in DB: ${snap.size}`);

  const counts: Record<string, number> = {};
  const names: Record<string, number> = {};

  snap.docs.forEach(doc => {
    const data = doc.data();
    const serviceCat = data.serviceCategoryId || 'unknown';
    counts[serviceCat] = (counts[serviceCat] || 0) + 1;

    const key = `${serviceCat} | ${data.categoryId} | ${data.name}`;
    names[key] = (names[key] || 0) + 1;
  });

  console.log('Features count by Service Category:', counts);

  console.log('\nChecking for duplicates (appearing > 1 times):');
  let duplicateCount = 0;
  for (const [key, count] of Object.entries(names)) {
    if (count > 1) {
      console.log(`- "${key}": ${count} times`);
      duplicateCount++;
    }
  }
  if (duplicateCount === 0) {
    console.log('No exact duplicates found.');
  } else {
    console.log(`Found ${duplicateCount} duplicate feature definitions.`);
  }
}

checkDb().catch(console.error);
