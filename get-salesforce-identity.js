const fetch = require('node-fetch');

module.exports = function getSalesforceIdentity(accessToken, idUrl, logger) {
  logger('-----> Get Salesforce identity');
  return fetch(idUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then( response => {
      const status = response.status;
      if (status >= 300) { throw new Error(`Request status ${status} for ${idUrl}`) }
      //logger('       response status', status);
      return response.json();
    })
    .then( salesforceIdentity => {
      //logger('       Identity', salesforceIdentity);
      return salesforceIdentity;
    });
}
