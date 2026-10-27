import type { ServiceRequest } from '@/types/request';
import type { Provider } from '@/types/provider';
import type { MatchResult } from '@/types/match';
import { cosineSimilarity } from '@/utils/similarity';
import { haversineKm, proximityScore } from '@/utils/location';

// Type-only import for the USE model — actual module is loaded dynamically
type UniversalSentenceEncoder = {
  embed: (inputs: string[]) => Promise<{
    array: () => Promise<number[][]>;
    dispose: () => void;
  }>;
};

let modelPromise: Promise<UniversalSentenceEncoder> | null = null;

export async function loadModel(): Promise<UniversalSentenceEncoder> {
  if (!modelPromise) {
    modelPromise = (async () => {
      // Dynamic imports to avoid blocking initial page load
      await import('@tensorflow/tfjs');
      const use = await import('@tensorflow-models/universal-sentence-encoder');
      return use.load() as Promise<UniversalSentenceEncoder>;
    })();
  }
  return modelPromise;
}

export async function runMatching(
  request: ServiceRequest,
  providers: Provider[],
): Promise<MatchResult[]> {
  if (providers.length === 0) return [];

  const model = await loadModel();
  const requestText = `${request.serviceType} ${request.description}`;
  const providerTexts = providers.map(p => `${p.skills.join(' ')} ${p.bio}`);
  const allTexts = [requestText, ...providerTexts];

  const embeddings = await model.embed(allTexts);
  const embeddingArray = await embeddings.array();
  embeddings.dispose();

  const requestEmbedding = embeddingArray[0];
  const results: MatchResult[] = [];

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    const providerEmbedding = embeddingArray[i + 1];
    const skillScore = cosineSimilarity(requestEmbedding, providerEmbedding);
    const distanceKm = haversineKm(
      request.location.latitude,
      request.location.longitude,
      provider.location.latitude,
      provider.location.longitude,
    );
    const proxScore = proximityScore(distanceKm);
    const finalScore = skillScore * 0.6 + proxScore * 0.4;

    if (finalScore >= 0.4) {
      results.push({
        providerId: provider.uid,
        displayName: provider.displayName,
        profilePhotoUrl: null,
        locationName: provider.locationName,
        skills: provider.skills,
        whatsappNumber: provider.whatsappNumber,
        email: provider.email,
        skillScore,
        proximityScore: proxScore,
        finalScore,
        distanceKm,
      });
    }
  }

  results.sort((a, b) => b.finalScore - a.finalScore);
  return results.slice(0, 10);
}
