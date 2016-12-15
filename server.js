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
const cookieParser = require('cookie-parser')
// config - middleware

app.use(parser.json());
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.static('public'));
app.use('/', router);
app.use(passport.initialize());
app.use(passport.session());



app.use(require('express-session')({
  secret: 'penguins_in_the_mist',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 6.048e8
  }
}));




passport.use('local-login', new LocalStrategy(function(username, password, done) {
  db.User
    .find({where: {username: username}})
    .then(function(results) {
      if (!results) {
        // console.log('No results',results)
        return done(null, false);
      }
      if (!(controller.user.checkPassword(results.dataValues.password, password))) {
        console.log('wrong password');
        return done(null, false);
      }

      return done(null, results.dataValues);
      console.log('successful login');
    });
}));


// routes
// Connect controller methods to their corresponding routes
router.get('/questions', controller.questions.get);
router.post('/questions', controller.questions.post);
router.post('/auth/login', passport.authenticate('local-login'));
router.post('/auth/signup', controller.user.post);

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(username, done) {
  db.User.find({where: {username: username}})
    .then(function(results) {
      if (!results) return done(new Error('Invalid user'));
      return done(null, results);
    });
});
// port
app.set('port', 1337);
// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

module.exports.app = app;
module.exports = router;
