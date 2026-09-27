import { createClient } from '@sanity/client';
import { LEADERSHIP_PROJECTS_DATA } from './helpers/leadershipProjectsData.js';
import fs from 'fs';

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

async function migrateData() {
  console.log("🚀 Starting migration of Leadership Projects to Sanity...");

  const projects = Object.values(LEADERSHIP_PROJECTS_DATA);
  let successCount = 0;

  for (const project of projects) {
    try {
      const formattedImages = project.images ? project.images.map(img => ({
        _type: 'externalMedia',
        _key: Math.random().toString(36).substring(7),
        filename: img.filename,
        url: img.url
      })) : [];

      const formattedAccessPoints = project.accessPoints ? project.accessPoints.map(ap => ({
        _key: Math.random().toString(36).substring(7),
        label: ap.label,
        url: ap.url
      })) : [];

      const formattedKernelLog = project.kernelLog ? project.kernelLog.map(log => ({
        _key: Math.random().toString(36).substring(7),
        date: log.date,
        action: log.action,
        desc: log.desc
      })) : [];
      
      const formattedMetrics = project.metrics ? project.metrics.map(metric => ({
        _key: Math.random().toString(36).substring(7),
        label: metric.label,
        value: metric.value
      })) : [];

      const doc = {
        _type: 'leadershipProject',
        project: project.project,
        role: project.role,
        status: project.status,
        timeframe: project.timeframe,
        directives: project.directives,
        kernelLog: formattedKernelLog,
        metrics: formattedMetrics,
        accessPoints: formattedAccessPoints,
        images: formattedImages,
      };

      await client.create(doc);
      console.log(`✅ Uploaded: ${project.project}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to upload ${project.project}:`, err.message);
    }
  }

  console.log(`🎉 Migration complete! Successfully uploaded ${successCount} leadership projects.`);
}

migrateData();
