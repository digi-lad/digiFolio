import fs from 'fs'

try {
  const envConfig = JSON.parse(fs.readFileSync('env.json', 'utf8'));
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
} catch (error) {
  // env.json not found, use environment variables from platform
  console.log('env.json not found, using platform environment variables');
}