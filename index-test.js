const test = require('ava')
const nock = require('nock')
const jsforceConnection = require('.')

test('Default export is .connection', t => {
  t.is(jsforceConnection.default, jsforceConnection.connection);
});

test('.connection eventually returns an authenticated Salesforce API connection', t => {
  t.plan(2)

  process.env.SALESFORCE_URL = 'force://MOCK_CLIENT_ID:MOCK_SECRET:MOCK_REFRESH_TOKEN@naXX.salesforce.com'
  mockSuccessfulAuth()

  return jsforceConnection.connection('37.0')
    .then( salesforceApi => {
      t.is('https://naxx.salesforce.com', salesforceApi.instanceUrl)
      t.is('00D36000001HDi3!ARwAQMgrOWZ_pF7MTbMr27MLFakDJJPZ3gZ7XmXJGDN_str65top.OSBfEr5.ix_Xw55001M7sHk6.LqC0fRCqDZWEb5knmo', salesforceApi.accessToken)
    })
})



function mockSuccessfulAuth() {

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .replyDate()
    .post('/services/oauth2/token')
    .query({"grant_type":"refresh_token","client_id":"MOCK_CLIENT_ID","client_secret":"MOCK_SECRET","refresh_token":"MOCK_REFRESH_TOKEN"})
    .reply(200, ["1f8b0800000000000000","5d905b6f82401085dffd1594d736807253933e20a88448bdb4899617b22e0b2e975ddc5d429ba6ffbd0abcd4793cf39d9933f3339224194088388f052d1091a5b9246b9aa75bdabdc6be87f527e7d03afb3063db6314d72b3bfc38876c62879b1528bc20d8457a16d9a7ea14acbdb7980b669982d6caf67d912e99a9e0aff8d49ae66d566873bfb094cdd5d5d2837bf5a2e3f26c16a4a2f2cb3d06c71901a261a8cb90ec3e7d7f8f5c8773e719abea222ff20d2c138f1ae3751e18766a5e71ae576dba7f1dfc90d6bd97a194217ee92f92d2a62c7b02132e0081286e58d98117216a3e575502744de1a0443ca50c2205d26a7024ffb89266983c802a4ed487872d9df54d320769b2ab28721cb79fd8658ac5f710758100436c58c67983921888ae3336ac99664c756d3ab166f2e8f70fa154445bab010000"], {
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    pragma: 'no-cache',
    'cache-control': 'no-store',
    'content-type': 'application/json;charset=UTF-8',
    'content-encoding': 'gzip',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .replyDate()
    .get('/id/00D36000001HDi3EAG/00536000002PmoeAAC')
    .reply(200, ["1f8b0800000000000000","ad954d73d3301086ff0aa32b89ed3869487daa87b4706080a1edd9a3c8eb44204b465a67683bfdefac647b92944e2129b9c4b37af759ed87d70f4c962c631bc4c66571accc5aeac87105ae325640244c1dcb324e92e5749ef8dfe4e3524e2ff30f643aeb4de9d7da409ebf6723c69d038b50162dfdb30c6d0b23e69f8b10e6591f63d75ccb7b8ed2e841f6341aeb289ad740e7256c2f9cb01cc5663c4d17111148a0a5f851ec149368367f974ed3f46c32a7a7c56c76394949564ad7287e3728af8634df2c610bca3474ef11839a4b45a73ee805fce275a38268382ab6606525a11c72aca475f80793e48aefecfb1150d6706fb437e735c1048f3f1957e47a0d547c12341b83c6b1ec813552606b61af4d22d27c9a50048da031dab5aab1a6920a82afef507ce5436dda7aa5bb848e27dcb047ea6b59dac2a1054096e956a9de2424de1d181c7284438969355a52b1db6bd6dbee6533686ab3a27005c5d3f09c6dafd215578e4aed43b4a130c202f7c356eec55c99b2bf115dbbb52a082945b08d956ebf88a1004f469ddabd95025c7c6d78138bf881a23b9acbc7a76f00655203728acc8f42d62f221b6e51fb17e70862fb22d182c37fc5f964e2ed8e46eeceacbe8340772a62f00f2ce0566c4e26056fcff9d94218a79330c1390e85113415a7623a6fcfe9df97bf809e5d7c1540797265c586230d75dc41466c6d4ddbbc9ad653ba6dfb6a5a07e9122d2442fd5fb21d7724bf9504ca2d1c7c66f0aef1bdb8bec93f2ff36fcbb080f5bae56b6f055d841da48ce06adfd0a2f85255ce2fb771ba588446f5abbb3665583ffd92616932998f93f9383dbf49936c9a64b3f388d46fbd0b7bfc0dc03551c64f070000"], {
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    'content-type': 'application/json;charset=UTF-8',
    'content-encoding': 'gzip',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  }
