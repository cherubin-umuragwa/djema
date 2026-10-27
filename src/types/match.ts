import type { Timestamp } from 'firebase/firestore';

export type MatchStatus = 'processing' | 'completed' | 'no_matches';

export interface MatchResult {
  providerId: string;
  displayName: string;
  profilePhotoUrl: string | null;
  locationName: string;
  skills: string[];
  // whatsappNumber and email are intentionally omitted here — MatchDocument is publicly readable
  // (allow read: if true). Contact details are resolved at display time from the provider document.
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
