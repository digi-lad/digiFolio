import https from 'https';

https.get('https://api.allorigins.win/raw?url=https%3A%2F%2Fcdn.sanity.io%2Ffiles%2Fvlmaq5o3%2Fproduction%2F31eb8d4ec79dc1caef264c83acba64ea9db22697.pdf', (res) => {
  console.log(res.statusCode, res.headers);
});
