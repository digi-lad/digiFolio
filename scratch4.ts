import https from 'https';

function check(url: string) {
  https.get(url, (res) => {
    console.log(url, res.statusCode, res.headers['x-frame-options']);
  });
}

check('https://docs.google.com/viewer?url=https%3A%2F%2Fcdn.sanity.io%2Ffiles%2Fvlmaq5o3%2Fproduction%2F31eb8d4ec79dc1caef264c83acba64ea9db22697.pdf&embedded=true');
check('https://docs.google.com/gview?url=https%3A%2F%2Fcdn.sanity.io%2Ffiles%2Fvlmaq5o3%2Fproduction%2F31eb8d4ec79dc1caef264c83acba64ea9db22697.pdf&embedded=true');
