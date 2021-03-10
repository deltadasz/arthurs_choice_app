// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const url1 = 'https://arthurschoice.ro/wp-json/wc/v3';
const authUrl1 = 'https://arthurschoice.ro/wp-json/jwt-auth/v1/token';
const tokenVerifyUrl1 = 'https://arthurschoice.ro/wp-json/jwt-auth/v1/token/vlaidate';


export const environment = {
  production: false,
  backend_api_url: url1,
  auth_url: authUrl1,
  token_verify_url: tokenVerifyUrl1,
  readOnlyKeys: {
    consumer_keys: 'ck_a4af456d8e85b54520784f608115e942e32243e0',
    consumer_secret: 'cs_da0b126cdbe8e5037f6684f0bc72a4618d6eab82'
  },
  writableKeys: {
    consumer_keys: 'ck_1f76d3e7720a841ccef973672b513b6a60785f74',
    consumer_secret: 'cs_2edae648cee333d5225194d7fa7a7efb1af281e7'
  },
  states: [
    {value: 'AB', name: 'Alba'},
    {value: 'AR', name: 'Arad'},
    {value: 'AG', name: 'Argeș'},
    {value: 'BC', name: 'Bacău'},
    {value: 'BH', name: 'Bihor'},
    {value: 'BN', name: 'Bistrița-năsăud'},
    {value: 'BT', name: 'Botoșani'},
    {value: 'BV', name: 'Brașov'},
    {value: 'BR', name: 'Brăila'},
    {value: 'B', name: 'București'},
    {value: 'BZ', name: 'Buzău'},
    {value: 'CS', name: 'Caraș-severin'},
    {value: 'CL', name: 'Călărași'},
    {value: 'CJ', name: 'Cluj'},
    {value: 'CT', name: 'Constanța'},
    {value: 'cv', name: 'Covasna'},
    {value: 'DB', name: 'Dâmbovița'},
    {value: 'DJ', name: 'Dolj'},
    {value: 'GL', name: 'Galați'},
    {value: 'GR', name: 'Giurgiu'},
    {value: 'GJ', name: 'Gorj'},
    {value: 'HR', name: 'Harghita'},
    {value: 'HD', name: 'Hunedoara'},
    {value: 'IL', name: 'Ialomița'},
    {value: 'IS', name: 'Iași'},
    {value: 'IF', name: 'Ilfov'},
    {value: 'MM', name: 'Maramureș'},
    {value: 'MH', name: 'Mehedinți'},
    {value: 'MS', name: 'Mureș'},
    {value: 'NT', name: 'Neamț'},
    {value: 'OT', name: 'Olt'},
    {value: 'PH', name: 'Prhaova'},
    {value: 'SM', name: 'Satu Mare'},
    {value: 'SJ', name: 'Sălaj'},
    {value: 'SB', name: 'Sibiu'},
    {value: 'SV', name: 'Suceava'},
    {value: 'TR', name: 'Teleorman'},
    {value: 'TM', name: 'Timiș'},
    {value: 'TL', name: 'Tulcea'},
    {value: 'VS', name: 'Vaslui'},
    {value: 'VL', name: 'Vâlcea'},
    {value: 'VN', name: 'Vrancea'}
    ]

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
