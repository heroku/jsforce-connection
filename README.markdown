jsforce-connection
==================
Create an instantly reliable jsforce connection.

[![Build Status](https://travis-ci.com/heroku/jsforce-connection.svg?token=fjyAVgyXed9CuzyfbQus&branch=master)](https://travis-ci.com/heroku/jsforce-connection)

Get a promise for an authenticated [jsforce](https://jsforce.github.io) connection based on the `SALESFORCE_URL` env variable or config JSON.

Exclusively uses the user account's Salesforce instance URL, e.g. `https://na30.salesforce.com`, to avoid race conditions with replication to the centralized login service, e.g. `htttps://login.salesforce.com`.

Install
-------

`npm install jsforce-connection --save`

Usage
-----

See: [jsforce docs](https://jsforce.github.io/document/) for how to use a connection, once established.

### Create a connection

⚠️ *Previous versions of this module would cache the connection. This is no longer the case. If you need a reusable singleton, then cache & share the connection outside of this module.*

#### with `SALESFORCE_URL` environment variable

  * *Must include oAuth client ID, secret, & refresh token*
  * Example: `force://{client-id}:{secret}:{refresh-token}@{instance-name}.salesforce.com`

Example:

```javascript
const createConnection = require('jsforce-connection').default;

createConnection()
  .then( salesforceApi => {
    console.log(`jsforce connected to ${salesforceApi.instanceUrl}`)
  });
```

#### with config JSON

Example:

```javascript
const createConnectionFromConfig = require('jsforce-connection').connectionFromConfig;

createConnectionFromConfig({
    clientId : 'XXXXX',
    clientSecret : '12345',
    refreshToken : 'YYYYY',
    instanceUrl : `https://naZZ.salesforce.com`
  })
  .then( salesforceApi => {
    console.log(`jsforce connected to ${salesforceApi.instanceUrl}`)
  });
```

### Tips & Tricks

#### Handle errors

[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) after `connection*` calls to handle errors from the async flow (log|exit|retry).

#### Force.com API version

Pass the API version number as the *last argument* to any of the `connection*` functions.

Example:

```javascript
const createConnection = require('jsforce-connection').default;

createConnection('32.0')
  .then( salesforceApi => {
    console.log(`jsforce connected to v32.0 on ${salesforceApi.instanceUrl}`)
  });
```

#### Logging

Normally this module's behavior will be silent, no log output.

To enable logging to stderr, set environment `VERBOSE=true`.

⚠️ *Making a change to this module? Never log to stdout, as that will pollute the output of some command-line tools that depend on this module.*


Testing
-------

Implemented with [AVA](https://github.com/avajs/ava), concurrent test runner.

`npm test` or `npm run test`
