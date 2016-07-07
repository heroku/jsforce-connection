const url = require('url');
const fetch = require('node-fetch');

module.exports = function refreshSalesforceAuth(config) {
  if (config.instanceUrl == null || config.clientId == null || config.clientSecret == null || config.refreshToken == null) {
    throw new Error('Requires arguments `instanceUrl, clientId, clientSecret, refreshToken`');
  }
  const query = `grant_type=refresh_token&client_id=${
    encodeURIComponent(config.clientId)}&client_secret=${
    encodeURIComponent(config.clientSecret)}&refresh_token=${
    encodeURIComponent(config.refreshToken)}`;
  const refreshAuthUrl = `${config.instanceUrl}/services/oauth2/token?${query}`;

  console.log('-----> Refresh Salesforce auth');
  return fetch(refreshAuthUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      }
    })
    .then( response => {
      const status = response.status;
      if (status >= 300) { throw new Error(`Request status ${status} for ${refreshAuthUrl}`) }
      //console.log('       response status', status);
      return response.json();
    })
    .then( salesforceAuth => {
      // Reset the identity URL to the specified instance host, otherwise Salesforce always uses "login.salesforce.com"
      const salesforceIdentityUrl = url.parse(salesforceAuth.id);
      salesforceIdentityUrl.host = url.parse(config.instanceUrl).host;
      const idUrl = url.format(salesforceIdentityUrl);
      //console.log(`       instance identity URL ${idUrl}`);
      return {
        accessToken: salesforceAuth.access_token,
        idUrl
      }
    });
};
