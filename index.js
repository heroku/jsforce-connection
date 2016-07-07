const urlParse = require('url').parse;
const jsforce = require('jsforce');
const requireEnvVar = require('./require-env-var');
const refreshSalesforceAuth = require('./refresh-salesforce-auth');
const getSalesforceIdentity = require('./get-salesforce-identity');

const configFromUrl = function(url) {
  const forceComAlmUrl = urlParse(url);
  const forceComAuth = forceComAlmUrl.auth.split(':');
  return {
    clientId : forceComAuth[0],
    clientSecret : forceComAuth[1],
    refreshToken : forceComAuth[2],
    instanceUrl : `https://${forceComAlmUrl.host}`
  };
};

const connection = function() {
  return connectionFromUrl(requireEnvVar('SALESFORCE_URL'));
};

const connectionFromUrl = function(url) {
  return connectionFromConfig(configFromUrl(url));
};

// Return Promise of authenticated jsForce connection.
const connectionFromConfig = function(config, forceComVersion = '37.0') {

  console.log('-----> Force.com connecting', config.instanceUrl);

  // Dynamic assignments with top-level scope
  let forceComAuthToken;

  let connection;

  return refreshSalesforceAuth(config)
    .then( ({accessToken, idUrl}) => {
      forceComAuthToken = accessToken;
      connection = new jsforce.Connection({
        accessToken: config.accessToken,
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
  connection,
  connectionFromUrl,
  connectionFromConfig
};
