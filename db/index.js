var Sequelize = require('sequelize');
var db = new Sequelize('crashcourse', 'root', '');

var User = db.define('user', {
  username: { type: Sequelize.STRING, field: 'username', unique: 'username' },
  password: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING
});

var Test = db.define('test', {
  test: Sequelize.STRING,
  category: Sequelize.STRING,
  public: Sequelize.BOOLEAN
});

var Question = db.define('question', {
  name: Sequelize.STRING,
  correct: Sequelize.STRING,
  wrong1: Sequelize.STRING,
  wrong2: Sequelize.STRING,
  wrong3: Sequelize.STRING
});

var Result = db.define('result', {
  correct: Sequelize.INTEGER,
  incorrect: Sequelize.INTEGER
});

var UsersTests = db.define('userstests', {});

//creates a foreign key for testId in Question Table
Question.belongsTo(Test);
//creates foreign keys for userId and testId in Results table
Result.belongsTo(User);
Result.belongsTo(Test);
//creates an invisible UsersTests table
//This will add methods getUsers, setUsers, addUsers to Test, and getTests, setTests and addTest to User.
User.belongsToMany(Test, {through: UsersTests});
Test.belongsToMany(User, {through: UsersTests});

// Make it so that you can add to a test that you saved.
Test.belongsTo(User);
Question.belongsTo(User);


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
Result.sync();
Test.sync();
UsersTests.sync();

exports.User = User;
exports.Question = Question;
exports.Result = Result;
exports.Test = Test;
exports.UsersTests = UsersTests;
