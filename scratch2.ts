import https from 'https';

https.get('https://cdn.sanity.io/files/vlmaq5o3/production/31eb8d4ec79dc1caef264c83acba64ea9db22697.pdf', (res) => {
  console.log(res.headers);
});
