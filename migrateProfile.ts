import { createClient } from '@sanity/client';
import fs from 'fs';

// Read existing constants
import { PROFILE_DATA } from './helpers/profileData.js';
import { ACHIEVEMENTS_DATA } from './helpers/achievementsData.js';
import { CONTACT_CHANNELS } from './helpers/contactData.js';

// Parse .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const lines = envFile.split('\n');
const tokenLine = lines.find(line => line.includes('SANITY_WRITE_TOKEN'));
const token = tokenLine ? tokenLine.split('=')[1].replace(/"/g, '').trim() : null;

if (!token) {
  console.error("Error: Missing SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: 'vlmaq5o3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: token,
});

async function migrateProfile() {
  console.log('Migrating profile...');

  // Flatten achievements data
  const achievements = [];
  for (const year of Object.keys(ACHIEVEMENTS_DATA)) {
    for (const month of Object.keys(ACHIEVEMENTS_DATA[year])) {
      for (const ach of ACHIEVEMENTS_DATA[year][month]) {
        achievements.push({
          _key: Math.random().toString(36).substring(7),
          year,
          month,
          title: ach.title,
          awardedBy: ach.awardedBy || '',
          tag: ach.tag,
          highlighted: ach.highlighted || false,
        });
      }
    }
  }

  // Flatten contact channels
  const contactChannels = CONTACT_CHANNELS.map(channel => ({
    _key: Math.random().toString(36).substring(7),
    id: channel.id,
    label: channel.label,
    icon: channel.id,
    value: channel.value,
    type: channel.type,
    url: channel.url || '',
  }));

  // Flatten gallery
  const gallery = PROFILE_DATA.gallery.map(g => ({
    _key: Math.random().toString(36).substring(7),
    filename: g.filename,
    url: g.url,
  }));

  const doc = {
    _type: 'profile',
    name: PROFILE_DATA.name,
    education: PROFILE_DATA.education,
    sat: PROFILE_DATA.sat,
    ielts: PROFILE_DATA.ielts,
    bio: PROFILE_DATA.bio,
    avatarUrl: PROFILE_DATA.avatarUrl,
    resumeUrl: 'https://drive.google.com/file/d/1VT5y9VedovUcUyIwK6skPES53Tvs6JfX/view?usp=sharing',
    gallery,
    contactChannels,
    achievements,
  };

  try {
    const res = await client.create(doc);
    console.log('Created profile document', res._id);
  } catch (e) {
    console.error('Error creating profile', e);
  }
}

migrateProfile();
