// Setup - dependencies
const express = require('express');
const app = express();
// var app = require('express')();
const router = require('express').Router();
const morgan = require('morgan');
const parser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');
const db = require('./db');
const controller = require('./controllers');

//socketIO
var server = require('http').Server(app);
var io = require('socket.io')(server);
//socket server-side event emitters
// const io = require('./controllers/socketConfig');
require ('./controllers/socketConfig')(io);

io.on('connection', function(socket) {
  console.log('a user connected');
});

// config - middleware
app.use(morgan('dev'));
app.use(parser.json());
app.use(express.static('public'));
app.use(require('express-session')({
  secret: 'penguins_in_the_mist',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 6.048e8
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', router);

passport.serializeUser(function(user, done) {
  console.log('SERIALIZE', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('DESERIALIZE', id);
  db.User
    .find({ where: {id: id} })
    .then( function(result) {
      done(null, result.dataValues);
    })
    .catch(function(err) {
      done(err, null);
    });
});

passport.use('local-login', new LocalStrategy({
  passReqToCallback: true
}, function(req, username, password, done) {
  db.User
    .find({ where: {username: username} })
    .then(function(result) {
      req.body = {
        firstname: result.dataValues.firstname,
        lastname: result.dataValues.lastname
      };
      if (!result) { return done(null, false); }
      if (!(controller.user.authenticate(password, result.dataValues.password))) {
        return done(null, false);
      }
      return done(null, result.dataValues);
    });
}));

// Routes
// Connect controller methods to their corresponding routes
router.get('/user', controller.user.get);
router.get('/categories', controller.categories.get);
router.get('/questions', controller.questions.get);
router.get('/quizzes/public', controller.quizzes.getPublic);
router.get('/quizzes', controller.quizzes.get);
router.post('/saveQuiz', controller.questions.save);
router.post('/questions', controller.questions.post);
router.post('/auth/login', passport.authenticate('local-login'), controller.user.login);
router.post('/auth/signup', controller.user.post);
router.get('/auth/signout', controller.user.logout);

// Port
app.set('port', 1337);
// If we are being run directly, run the server.
// need server.listen instead of app.listen for socket.io
if (!module.parent) {
  server.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

module.exports.app = app;
module.exports = router;
