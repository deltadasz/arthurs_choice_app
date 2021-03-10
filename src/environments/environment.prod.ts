const url1 = 'https://arthurschoice.ro/wp-json/wc/v3';
const authUrl1 = 'https://arthurschoice.ro/wp-json/jwt-auth/v1/token';
const tokenVerifyUrl1 = 'https://arthurschoice.ro/wp-json/jwt-auth/v1/token/vlaidate';

export const environment = {
  production: true,
  backend_api_url: url1,
  auth_url: authUrl1,
  token_verify_url: tokenVerifyUrl1,
  readOnlyKeys: {
    consumer_keys: 'ck_a4af456d8e85b54520784f608115e942e32243e0',
    consumer_secret: 'cs_da0b126cdbe8e5037f6684f0bc72a4618d6eab82'
  },
  writableKeys: {
    consumer_keys:   'ck_1f76d3e7720a841ccef973672b513b6a60785f74',
    consumer_secret: 'cs_2edae648cee333d5225194d7fa7a7efb1af281e7'
  }
};
