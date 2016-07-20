const urlParse = require('url').parse;
const jsforce = require('jsforce');
const requireEnvVar = require('./require-env-var');
const refreshSalesforceAuth = require('./refresh-salesforce-auth');
const getSalesforceIdentity = require('./get-salesforce-identity');
const loggers = require('./loggers');

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

function connection(forceComVersion) {
  return connectionFromUrl(requireEnvVar('SALESFORCE_URL'), forceComVersion);
};

function connectionFromUrl(url, forceComVersion) {
  return connectionFromConfig(configFromUrl(url), forceComVersion);
};

// Return Promise of authenticated jsForce connection.
function connectionFromConfig(config, forceComVersion = '37.0') {
  const env = process.env;
  let logger;
  if (env.VERBOSE === true || env.VERBOSE === 'true' || env.VERBOSE === '1') {
    // Log stream should not be mixed with stdout,
    // where output is written for some apps.
    logger = loggers.verbose;
  } else {
    logger = loggers.default;
  }

  logger('-----> Force.com connecting', config.instanceUrl);

  // Dynamic assignments with top-level scope
  let forceComAuthToken;
  let newConnection;

  return refreshSalesforceAuth(config, logger)
    .then( ({accessToken, idUrl}) => {
      forceComAuthToken = accessToken;
      newConnection = new jsforce.Connection({
        accessToken: accessToken,
        loginUrl: config.instanceUrl,
        instanceUrl: config.instanceUrl,
        serverUrl: `${config.instanceUrl}/services/Soap/u/${forceComVersion}`,
        version: forceComVersion
      });
      return getSalesforceIdentity(accessToken, idUrl, logger);
    })
    .then( res => {
      logger('-----> Salesforce org ID', res.organization_id);
      logger('-----> Salesforce admin user ID', res.user_id);
      logger('-----> Salesforce admin username', res.username);
      return newConnection;
    });

};

module.exports = {
  default: connection,
  configFromUrl,
  connection,
  connectionFromUrl,
  connectionFromConfig,
  urlFromConfig
};
