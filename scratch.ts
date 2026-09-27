import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vlmaq5o3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function run() {
  const data = await client.fetch(`*[_type == "profile"][0]{
        ...,
        resumes[]{
          ...,
          "fileUrl": file.asset->url
        }
      }`);
  console.log(JSON.stringify(data.resumes, null, 2));
}

run();
