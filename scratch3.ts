import https from 'https';

const options = {
  hostname: 'cdn.sanity.io',
  port: 443,
  path: '/files/vlmaq5o3/production/31eb8d4ec79dc1caef264c83acba64ea9db22697.pdf',
  method: 'GET',
  headers: {
    'Origin': 'http://localhost:5173'
  }
};

const req = https.request(options, (res) => {
  console.log(res.headers);
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
