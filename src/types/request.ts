import type { GeoPoint, Timestamp } from 'firebase/firestore';

export type RequestStatus = 'pending' | 'matched' | 'open' | 'fulfilled' | 'expired';

export interface ServiceRequest {
  id: string;
  sessionToken: string;
  serviceType: string;
  description: string;
  location: GeoPoint;
  locationName: string;
  estimatedHours: number;
  // photoUrl removed — Firebase Storage requires billing (not available on Spark plan)
  status: RequestStatus;
  isPublic: boolean;
  requesterWhatsapp: string | null;
  requesterEmail: string | null;
  descriptionEmbedding: number[] | null;
  matchCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt: Timestamp;
}

export type RequestFormValues = {
  serviceType: string;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  estimatedHours: number;
};
