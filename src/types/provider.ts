import type { GeoPoint, Timestamp } from 'firebase/firestore';

export interface Provider {
  uid: string;
  displayName: string;
  email: string;
  whatsappNumber: string;
  bio: string;
  skills: string[];
  location: GeoPoint;
  locationName: string;
  // profilePhotoUrl removed — Firebase Storage requires billing (not available on Spark plan)
  available: boolean;
  isActive: boolean;
  skillEmbedding: number[] | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProviderFormValues = {
  displayName: string;
  email: string;
  whatsappNumber: string;
  bio: string;
  skills: string[];
  locationName: string;
  lat: number;
  lng: number;
};
