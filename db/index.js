var Sequelize = require('sequelize');
var db = new Sequelize('crashcourse', 'root', '');

var User = db.define('User', {
  username: { type: Sequelize.STRING, field: 'username', unique: 'username' },
  password: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING
});

var Test = db.define('Test', {
  test: Sequelize.STRING,
  category: Sequelize.STRING,
  public: Sequelize.INTEGER
});

var Question = db.define('Question', {
  name: Sequelize.STRING,
  correct: Sequelize.STRING,
  wrong1: Sequelize.STRING,
  wrong2: Sequelize.STRING,
  wrong3: Sequelize.STRING
});

var Results = db.define('Results', {
  correct: Sequelize.INTEGER,
  incorrect: Sequelize.INTEGER
});

//creates a foreign key for testId in Question Table
Question.belongsTo(Test);
//creates foreign keys for userId and testId in Results table
Results.belongsTo(User);
Results.belongsTo(Test);
//creates an invisible UsersTests table
//This will add methods getUsers, setUsers, addUsers to Test, and getTests, setTests and addTest to User.
User.belongsToMany(Test, {through: 'UsersTests'});
Test.belongsToMany(User, {through: 'UsersTests'});

// If we are adding columns or otherwise changing the schema
// we can add {force: true} inside .sync to drop the tables
// NOTE: THIS DELETES ALL THE DATA IN THE TABLE
User.sync()
  .then(function(err) {
    console.log('Created Users Table!');
  }, function (err) {
    console.log('An error occurred while creating the Users table:', err);
  });

Question.sync();
Results.sync();
Test.sync();

exports.User = User;
exports.Question = Question;
exports.Results = Results;
exports.Test = Test;
