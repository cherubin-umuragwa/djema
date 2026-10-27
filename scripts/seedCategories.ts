/**
 * Seed script — populates the Firestore `categories` collection.
 * Run with: npx tsx scripts/seedCategories.ts
 *
 * NOTE: import.meta.env is NOT available in Node.js / tsx scripts.
 * The Firebase client config is PUBLIC (not secret) and is inlined here
 * intentionally — this is the standard pattern for client-side Firebase usage.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Public client-side config — safe to commit.
const firebaseConfig = {
  apiKey: 'AIzaSyDqHwEofT_ujn9egOrhX1HH476919Ow3MQ',
  authDomain: 'djema-dev.firebaseapp.com',
  projectId: 'djema-dev',
  storageBucket: 'djema-dev.firebasestorage.app',
  messagingSenderId: '868561675343',
  appId: '1:868561675343:web:46e773419c0bb19bd6763a',
  measurementId: 'G-F6XXELWYNW',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface CategorySeed {
  id: string;
  label: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const categories: CategorySeed[] = [
  { id: 'plumber',       label: 'Plumber',                icon: 'Wrench',      sortOrder: 1,  isActive: true },
  { id: 'electrician',   label: 'Electrician',            icon: 'Zap',         sortOrder: 2,  isActive: true },
  { id: 'carpenter',     label: 'Carpenter',              icon: 'Hammer',      sortOrder: 3,  isActive: true },
  { id: 'painter',       label: 'Painter',                icon: 'Paintbrush',  sortOrder: 4,  isActive: true },
  { id: 'cleaner',       label: 'Cleaner House Help',     icon: 'Sparkles',    sortOrder: 5,  isActive: true },
  { id: 'mechanic',      label: 'Mechanic',               icon: 'Settings',    sortOrder: 6,  isActive: true },
  { id: 'tailor',        label: 'Tailor Seamstress',      icon: 'Scissors',    sortOrder: 7,  isActive: true },
  { id: 'mason',         label: 'Mason Builder',          icon: 'HardHat',     sortOrder: 8,  isActive: true },
  { id: 'welder',        label: 'Welder',                 icon: 'Flame',       sortOrder: 9,  isActive: true },
  { id: 'driver',        label: 'Driver Boda Boda',       icon: 'Car',         sortOrder: 10, isActive: true },
  { id: 'gardener',      label: 'Gardener',               icon: 'Leaf',        sortOrder: 11, isActive: true },
  { id: 'it_technician', label: 'IT Computer Repair',     icon: 'Monitor',     sortOrder: 12, isActive: true },
  { id: 'beautician',    label: 'Beautician Hairdresser', icon: 'Smile',       sortOrder: 13, isActive: true },
  { id: 'tutor',         label: 'Tutor Teacher',          icon: 'BookOpen',    sortOrder: 14, isActive: true },
  { id: 'photographer',  label: 'Photographer',           icon: 'Camera',      sortOrder: 15, isActive: true },
  { id: 'other',         label: 'Other',                  icon: 'Star',        sortOrder: 16, isActive: true },
];

async function seed(): Promise<void> {
  for (const cat of categories) {
    await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
    process.stdout.write(`Seeded: ${cat.id}\n`);
  }
  process.stdout.write(`Done — ${categories.length} categories seeded.\n`);
}

seed().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write('Seed failed: ' + message + '\n');
  process.exit(1);
});
