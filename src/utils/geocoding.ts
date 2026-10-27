export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function geocodeLocation(
  query: string,
): Promise<NominatimResult[]> {
  const url =
    'https://nominatim.openstreetmap.org/search' +
    `?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=ug,ke,tz,rw,et`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'Djema/1.0' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Geocoding failed: ' + message);
  }

  if (!response.ok) {
    throw new Error(
      'Geocoding failed: server returned ' + response.status,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Geocoding failed: unexpected response format');
  }

  return (data as NominatimResult[]).filter(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.display_name === 'string' &&
      typeof item.lat === 'string' &&
      typeof item.lon === 'string',
  );
}
