// setup - dependencies
const express = require('express');
const app = express();
const router = require('express').Router();
const morgan = require('morgan');
const parser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const controller = require('./controllers');

// config - middleware
app.use(morgan('dev'));
app.use(parser.json());
app.use('/', router);
app.use(express.static('public'));
app.use(require('express-session')({
  secret: 'penguins_in_the_mist',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 6.048e8
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local-login', new LocalStrategy(function(username, password, done) {
}));

passport.use('local-signup', new LocalStrategy(function(username, password, done) {
  db.User
    .find( {where: {username: username}} )
    .then( function(err, result) {
      if (err) { console.error(err); }
    });
}));

// routes
// Connect controller methods to their corresponding routes
router.get('/questions', controller.questions.get);
router.post('/questions', controller.questions.post);
router.post('/auth/login', passport.authenticate('local-login'));
router.post('/auth/signup', controller.user.post);

// port
app.set('port', 1337);
// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

module.exports.app = app;
module.exports = router;
