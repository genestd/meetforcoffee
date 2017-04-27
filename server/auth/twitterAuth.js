var twitterAuth = {
  consumerKey: process.env.CLIENT_KEY,
  consumerSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.APP_URL + '/auth/twitter/callback'
}

module.exports = twitterAuth;
