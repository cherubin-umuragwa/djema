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
  profilePhotoUrl: string | null;
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
  profilePhotoUrl?: string;
};
