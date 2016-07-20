const urlParse = require('url').parse;
const jsforce = require('jsforce');
const requireEnvVar = require('./require-env-var');
const refreshSalesforceAuth = require('./refresh-salesforce-auth');
const getSalesforceIdentity = require('./get-salesforce-identity');

function configFromUrl(url) {
  const forceComAlmUrl = urlParse(url);
  const forceComAuth = forceComAlmUrl.auth.split(':');
  return {
    clientId : forceComAuth[0],
    clientSecret : forceComAuth[1],
    refreshToken : forceComAuth[2],
    instanceUrl : `https://${forceComAlmUrl.host}`
  };
};

function urlFromConfig(config) {
  return `force://${config.clientId}:${config.clientSecret}:${config.refreshToken}@${config.instanceUrl}`
};

function connection() {
  return connectionFromUrl(requireEnvVar('SALESFORCE_URL'));
};

function connectionFromUrl(url) {
  return connectionFromConfig(configFromUrl(url));
};

// Return Promise of authenticated jsForce connection.
function connectionFromConfig(config, forceComVersion = '37.0') {

  console.log('-----> Force.com connecting', config.instanceUrl);

  // Dynamic assignments with top-level scope
  let forceComAuthToken;

  let connection;

  return refreshSalesforceAuth(config)
    .then( ({accessToken, idUrl}) => {
      forceComAuthToken = accessToken;
      connection = new jsforce.Connection({
        accessToken: accessToken,
        loginUrl: config.instanceUrl,
        instanceUrl: config.instanceUrl,
        serverUrl: `${config.instanceUrl}/services/Soap/u/${forceComVersion}`,
        version: forceComVersion
      });
      return getSalesforceIdentity(accessToken, idUrl);
    })
    .then( res => {
      console.log('-----> Salesforce org ID', res.organization_id);
      console.log('-----> Salesforce admin user ID', res.user_id);
      console.log('-----> Salesforce admin username', res.username);
      return connection;
    });

};

module.exports = {
  configFromUrl,
  connection,
  connectionFromUrl,
  connectionFromConfig,
  urlFromConfig
};
