/**
 * seedDemo.ts
 * Seeds 8 demo providers and 3 open requests into Firestore for the hackathon demo.
 * Run with: npx tsx scripts/seedDemo.ts
 *
 * Requires .env.local to be present with valid Firebase config.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  GeoPoint,
  Timestamp,
} from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error('Missing Firebase config. Make sure .env.local is present.');
  process.exit(1);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// ─── Demo Providers ────────────────────────────────────────────────────────
const PROVIDERS = [
  {
    uid: 'demo-provider-001',
    displayName: 'Grace Nakato',
    email: 'grace.nakato@demo.djema.app',
    whatsappNumber: '+256701234001',
    bio: 'Certified electrician with 6 years of experience in Kampala. I handle wiring, installations, fault finding, and solar panel setups. Available on short notice.',
    skills: ['electrician', 'solar_installer'],
    location: new GeoPoint(0.3476, 32.6342),
    locationName: 'Ntinda, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
  {
    uid: 'demo-provider-002',
    displayName: 'Moses Ssemakula',
    email: 'moses.ssemakula@demo.djema.app',
    whatsappNumber: '+256701234002',
    bio: 'Experienced plumber based in Wandegeya. I fix leaks, install pipes, repair tanks, and handle bathroom fittings. Same-day service available.',
    skills: ['plumber'],
    location: new GeoPoint(0.3417, 32.5668),
    locationName: 'Wandegeya, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
  {
    uid: 'demo-provider-003',
    displayName: 'Sarah Akello',
    email: 'sarah.akello@demo.djema.app',
    whatsappNumber: '+256701234003',
    bio: 'Professional house cleaner and domestic helper with 4 years experience. I do deep cleaning, laundry, and general house help. Trustworthy and reliable.',
    skills: ['cleaner'],
    location: new GeoPoint(0.3720, 32.6180),
    locationName: 'Kisaasi, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
  {
    uid: 'demo-provider-004',
    displayName: 'David Ouma',
    email: 'david.ouma@demo.djema.app',
    whatsappNumber: '+256701234004',
    bio: 'Skilled carpenter and furniture maker based in Bukoto. I build custom furniture, fix doors and windows, and do general woodwork. Quality guaranteed.',
    skills: ['carpenter'],
    location: new GeoPoint(0.3398, 32.6012),
    locationName: 'Bukoto, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
  {
    uid: 'demo-provider-005',
    displayName: 'Fatuma Nabirye',
    email: 'fatuma.nabirye@demo.djema.app',
    whatsappNumber: '+256701234005',
    bio: 'Tailor and seamstress in Kalerwe. I make dresses, suits, uniforms, and alterations. Fast turnaround and affordable prices.',
    skills: ['tailor'],
    location: new GeoPoint(0.3601, 32.5712),
    locationName: 'Kalerwe, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
  {
    uid: 'demo-provider-006',
    displayName: 'Joseph Mugisha',
    email: 'joseph.mugisha@demo.djema.app',
    whatsappNumber: '+256701234006',
    bio: 'House and commercial painter with 8 years experience across Kampala. Interior and exterior, waterproofing, and decorative finishes.',
    skills: ['painter'],
    location: new GeoPoint(0.3305, 32.6171),
    locationName: 'Naguru, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
  {
    uid: 'demo-provider-007',
    displayName: 'Christine Namutebi',
    email: 'christine.namutebi@demo.djema.app',
    whatsappNumber: '+256701234007',
    bio: 'Beautician and hairdresser based in Bwaise. I do braids, weaves, natural hair treatments, facials, and manicures. Home visits available.',
    skills: ['beautician'],
    location: new GeoPoint(0.3543, 32.5580),
    locationName: 'Bwaise, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
  {
    uid: 'demo-provider-008',
    displayName: 'Robert Ssekandi',
    email: 'robert.ssekandi@demo.djema.app',
    whatsappNumber: '+256701234008',
    bio: 'IT technician and computer repair specialist at Makerere. Laptop and desktop repair, networking, software installation, data recovery, and CCTV setup.',
    skills: ['it_technician'],
    location: new GeoPoint(0.3350, 32.5681),
    locationName: 'Makerere, Kampala',
    available: true,
    isActive: true,
    skillEmbedding: null,
  },
];

// ─── Demo Open Requests ────────────────────────────────────────────────────
const REQUESTS = [
  {
    sessionToken: 'demo-session-req-001',
    serviceType: 'plumber',
    description: 'My bathroom tap has been leaking for two days and the water bill is going up. I need someone to come and fix it as soon as possible. The tap is in the main bathroom.',
    location: new GeoPoint(0.3210, 32.5713),
    locationName: 'Bwaise, Kampala',
    estimatedHours: 2,
    status: 'open',
    isPublic: true,
    requesterWhatsapp: '+256700111001',
    requesterEmail: 'client1@demo.djema.app',
    descriptionEmbedding: null,
    matchCount: 0,
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  },
  {
    sessionToken: 'demo-session-req-002',
    serviceType: 'electrician',
    description: 'There is no power in two rooms of my house. The main switch trips every time I turn it on. I think it might be a wiring issue. Please help.',
    location: new GeoPoint(0.3350, 32.6100),
    locationName: 'Kiwatule, Kampala',
    estimatedHours: 4,
    status: 'open',
    isPublic: true,
    requesterWhatsapp: '+256700111002',
    requesterEmail: null,
    descriptionEmbedding: null,
    matchCount: 0,
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  },
  {
    sessionToken: 'demo-session-req-003',
    serviceType: 'cleaner',
    description: 'I need a thorough house cleaning done this weekend. 3-bedroom house in Ntinda. Includes mopping, dusting, kitchen cleaning, and bathroom scrubbing.',
    location: new GeoPoint(0.3476, 32.6342),
    locationName: 'Ntinda, Kampala',
    estimatedHours: 8,
    status: 'open',
    isPublic: true,
    requesterWhatsapp: '+256700111003',
    requesterEmail: 'client3@demo.djema.app',
    descriptionEmbedding: null,
    matchCount: 0,
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  },
];

async function seed() {
  console.log('Seeding demo providers...');
  for (const provider of PROVIDERS) {
    await setDoc(doc(db, 'providers', provider.uid), {
      ...provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`  + Provider: ${provider.displayName} (${provider.locationName})`);
  }

  console.log('\nSeeding demo open requests...');
  for (const request of REQUESTS) {
    const ref = await addDoc(collection(db, 'requests'), {
      ...request,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`  + Request: ${request.serviceType} in ${request.locationName} (${ref.id})`);
  }

  console.log('\nDemo data seeded successfully.');
  console.log(`  ${PROVIDERS.length} providers`);
  console.log(`  ${REQUESTS.length} open requests`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
