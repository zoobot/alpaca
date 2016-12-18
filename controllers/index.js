var db = require('../db');
var bcrypt = require('bcrypt');
var saltRounds = 10;


module.exports = {
  // in quiz page, GET request will return object of all quiz Q's and A's
  questions: {
    get: function (req, res) {
      db.Test.find({
        where: {
          id: req.query.testId
        }
      }).then(test => {
        db.Question.findAll({
          where: {
            testId: test.id,
            $or: [{userId: test.userId}, {userId: req.session.passport.user}]
          }
        }).then(questions => res.json(questions));
      });
    },
    // in quiz Creation page, POST request will add an entry into database
    post: function (req, res) {
      if (req.body.ID !== undefined) {
        db.UsersTests.destroy({
          where: {
            testId: req.body.ID,
            userId: req.session.passport.user
          }
        })
        .then(function(response) {
          console.log('HERE ARE THE DELETE RESPONSE:', response);
          res.json(response);
        });
      } else {
        var user = req.session.passport.user;
        db.Test.findOrCreate({
          where: {test: req.body.testName}
        })
        .spread( (test, created) => {
          db.UsersTests.findOrCreate({
            where: {
              testId: test.get('id'),
              userId: user
            }
          });
          db.Question.create({
            name: req.body.name,
            correct: req.body.correct,
            wrong1: req.body.wrong1,
            wrong2: req.body.wrong2,
            wrong3: req.body.wrong3,
            testId: test.get('id'),
            userId: user
          });
        })
        .then( () => {
          res.sendStatus(201);
        });
      }
    },
    save: function(req, res) {
      db.UsersTests.create({
        testId: req.body.testId,
        userId: req.session.passport.user
      }).then( function(data) {
        res.sendStatus(201);
      });
    }
  },
  quizzes: {
    // Get the users quizzes.
    get: function(req, res) {
      db.UsersTests.findAll({
        where: {
          userId: req.session.passport.user
        }
      }).then(tests => {
        tests = tests.map(test => test.testId);
        db.Test.findAll({
          where: {
            id: {
              in: tests
            }
          }
        }).then(quizzes => res.json(quizzes));
      });
    },
    // Get all public quizzes.
    getPublic: function(req, res) {
      db.Test.findAll({
        where: {
          public: true
        }
      }).then(results => res.json(results));
    }
  },
  user: {
    get: function(req, res) {
      db.User.find({
        where: {
          id: req.query.id
        }
      }).then(result => res.json(result.firstname + ' ' + result.lastname));
    },
    authenticate: function (attempted, password) {
      return bcrypt.compareSync(attempted, password);
    },
    post: function (req, res) {
      db.User
        .find({where: {username: req.body.username}})
        .then(function(result) {
          if (!result) {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
              if (err) {
                console.log(err);
              }
              db.User.create({
                username: req.body.username,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
              }).then(function(user) {
                console.log('POSTED USER', user);
                res.sendStatus(201);
              });
            });
          }
        });
    },
    login: function(req, res) {
      res.send(req.body).status(201);
    },
    logout: function (req, res) {
      req.logout();
      res.redirect('/#/login');
    }
  },
  results: {
    // opportunity to keep track of results in database, sorting by userID.
    post: function (req, res) {
      db.Results.create({
        userID: req.body.userID,
        category: req.body.category,
        correct: req.body.correctAns,
        incorrect: req.body.wrongAns
      }).then(function(results) {
        res.sendStatus(201);
      });
    }
  },
  categories: {
    get: function(req, res) {
      res.json( ['English', 'History', 'Math', 'Science'] );
    }
  }
};
