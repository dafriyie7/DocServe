const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

// Initialize Dropbox with the access token and fetch function
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch
});

module.exports = dbx;