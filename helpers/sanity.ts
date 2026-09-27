import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'vlmaq5o3', // Extracted from your sanity configuration
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data every time
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
});

// Set up a helper function for generating Image URLs with only the asset reference data in your documents.
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
