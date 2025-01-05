'use server'

export async function getPlaceData(placeName: string, address: string): Promise<any | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('Google Places API key is not set');
    return null;
  }

  const query = `${placeName} ${address}`;
  const encodedQuery = encodeURIComponent(query);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch place data');
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const place = data.results[0];
      return {
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        photo: place.photos && place.photos.length > 0
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : '/placeholder.svg?height=400&width=400',
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching place data:', error);
    return null;
  }
}