import type { Timestamp } from 'firebase/firestore';

export type MatchStatus = 'processing' | 'completed' | 'no_matches';

export interface MatchResult {
  providerId: string;
  displayName: string;
  profilePhotoUrl: string | null;
  locationName: string;
  skills: string[];
  whatsappNumber: string;
  email: string;
  skillScore: number;
  proximityScore: number;
  finalScore: number;
  distanceKm: number;
}

export interface MatchDocument {
  requestId: string;
  status: MatchStatus;
  results: MatchResult[];
  processedAt: Timestamp | null;
  createdAt: Timestamp;
}
