import React from 'react';
import axios from 'axios';
import { VelocityComponent, VelocityTransitionGroup, velocityHelpers } from 'velocity-react';

export default class PrebuiltQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '', // opportunity to get ID for currently logged-in user to track results
      category: '', // opportunity to get category of current test to track results
      name: '',  // this is actually the question being asked (please change the name)
      correct: '',
      wrong1: '',
      wrong2: '',
      wrong3: '',
      questions: [],
      answers: [],
      randomAnswers: [],
      index: 0,
      timeCount: 15, // used for countdown
      correctAns: 0, // number of correct and wrong answer submissions for percent
      wrongAns: 0,
      startTimer: false, // no timer while choosing quiz.
      showTimer: false, // used to show timer after selecting a quiz
      quizName: '',
      quizNames: [],
      score: 0,
      completedQuiz: false, // when true ternary in render shows the summary component
      selectedQuiz: null,
      takingQuiz: false,
      //groupQuiz stuff
      url: null,
      group: true,
      room: 'Penquiz Challenge',
      currentQuiz: null,
      playing: false,
      showQuiz: false
    };
    socket.on('join', (room) => this.handleSelect(room));
  }

  componentDidMount() {
    this.getQuizes(); // generate drop down list to select test
    // this.GetQuestions();

    var self = this;
    socket.emit( 'join', self.state.room );
    socket.on('loadUrl', function(data){
      console.log('url loaded on clientside');
      self.setState({ url : data });
    });

    socket.on('startQuiz', function(){
      console.log('quiz started on clientside');


      self.setState({ started: !self.state.started});
      PrebuiltQuiz.setState({ selectedQuiz: 'planet' });
      console.log('selectedQuiz on clientside',PrebuiltQuiz.selectedQuiz);

    });
  }
  //socket io stuff
  handleChangeRoom(e) {
    this.setState({[e.target.name]: e.target.value});
  }
  handleChangeQuiz(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  emitRoomName(room){
    console.log('room name emit triggered');
    socket.emit('createRoom', {room});
    console.log('this is the room', room);
  }

  emitQuizUs() {
    socket.emit('quizUs');
    console.log('quizUs emitted from client-side!');
  }

  emitLoadUrl(url) {
    console.log('clientemit triggered');
    socket.emit('URL', {url});
    console.log(url);
  }
  //end of socketIO stuff

  // get all quizzes from server
  getQuizes() {
    axios.get('/quizzes')
      .then(response => {
        console.log(response);
        var entries = response.data;
        console.log(entries);
        var temp = [];
        entries.forEach(entry => {
          // Makes sure there is no duplicates.
          // if (temp.indexOf(entry.test) === -1) {
          //   temp.push(entry.test);
          // }
          temp.push([entry.test, entry.id]);
        });
        this.setState({
          quizNames: temp,
        });
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  componentDidUpdate() {
    if (this.state.startTimer) {
      this.handleTimeCount();
      this.setState({startTimer: false});
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  playCorrectSound() {
    // var audio = new Audio('./assets/correct.mp3');
    // audio.play();
  }
  playWrongSound() {
    // var audio = new Audio('./assets/wrongCrash.wav');
    // audio.play();
  }

  // grabs all the questions based on the selected quiz from the drop down list
  GetQuestions() {
    console.log('HERE IS QUIZ ID FROM THE FRONTEND: ', this.state.selectedQuiz);
    var config = {
      params: {
        ID: this.state.selectedQuiz
      }
    };
    var questions;
    var index = this.state.index;
    axios.get('/questions', config)
      .then(response =>{
        questions = response.data;
        this.setState({
          questions: this.state.questions.concat(questions),
        }, this.handleQuestionChange);
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  // *handle* functions take care of clicking the buttons, and the events of the
  // quiz
  handleClick(e) {
    if (this.state.correct === e.target.textContent) {
      this.handleCorrect();
    } else {
      this.handleWrong();
    }
  }

  handleCorrect() {
    this.playCorrectSound();
    this.setState({
      timeCount: 15,
      index: this.state.index + 1,
      answers: [],
      correctAns: this.state.correctAns + 1,
    }, this.handleQuestionChange);
  }

  handleWrong() {
    this.playWrongSound();
    this.setState({
      timeCount: 15,
      index: this.state.index + 1,
      answers: [],
      wrongAns: this.state.wrongAns + 1,
    }, this.handleQuestionChange);
  }

  handleTime() {
    this.setState({
      timeCount: this.state.timeCount - 1,
    }, function() {
      if (this.state.timeCount === 0) {
        this.handleWrong();
      }
      clearInterval(this.timer);
      this.setState({startTimer: true});
    });
  }
  handleTimeCount() {
    var that = this;
    this.timer = setInterval(function() {
      that.handleTime();
    }, 1000);
  }

  // after clicking an answer, index is incremented and the next question and
  // answer set is displayed
  handleQuestionChange() {
    var questions = this.state.questions;
    console.log("HERE ARE THE QUESTIONS: ", questions);
    var index = this.state.index;
    if (index === this.state.questions.length) {
      this.handleEndQuiz();
    } else {
      this.setState({
        name: questions[index].name,
        correct: questions[index].correct,
        wrong1: questions[index].wrong1,
        wrong2: questions[index].wrong2,
        wrong3: questions[index].wrong3,
        answers: this.state.answers.concat(questions[index].correct, questions[index].wrong1, questions[index].wrong2, questions[index].wrong3),
        randomAnswers: this.shuffleAnswers([questions[index].correct, questions[index].wrong1, questions[index].wrong2, questions[index].wrong3])
      });
    }
  }

  handleEndQuiz() {
    var percent = (this.state.correctAns / (this.state.questions.length)).toFixed(2) * 100;
    clearInterval(this.timer);
    this.setState({
      score: percent,
      completedQuiz: true,
    });
  }

  // on selecting a quiz, reset timer, correct answer count and wrong count,
  // and get the array of questions
  handleQuizSelect(e) {
    this.setState({
      quizName: e.target.value,
      questions: [],
      answers: [],
      index: 0,
      timeCount: 15,
      correctAns: 0,
      wrongAns: 0,
      showTimer: true,
    }, this.GetQuestions);

  }

  shuffleAnswers(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;

    }
    return array;
  }

  handleSelect(target) {
    this.setState({
      selectedQuiz: target
    });
  }

  handleDelete(id) {
    // This is where the request to delete and quiz will be sent from.
    // id is the testId to be deleted.
    axios.post('/questions', {ID: id})
      .then(response =>{
        console.log(response);
        this.getQuizes();
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  startQuiz() {
    if (this.state.selectedQuiz !== null) {
      // Send out API call to get Quiz questions.
      // Once we have the question change the state.
      this.GetQuestions();
      this.setState({
        takingQuiz: true,
        startTimer: true
      });
    }
  }

  takeAnotherQuiz() {
    this.setState({
      completedQuiz: false,
      takingQuiz: false,
      startTimer: false,
      selectedQuiz: null
    });
  }

          // ternary is used in render to render the completed page if this.state.CompletedQuiz is true :)
          // ternary is also used to display the Timer only after a test has been selected
  render() {
    return (
      <div className="App">
      {
          this.state.completedQuiz

          ?

          <div>
            <h1>quiz complete, your score is: {this.state.score}%!</h1>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.takeAnotherQuiz.bind(this)}>Take Another Quiz
            </button>
          </div>

          :

          !this.state.takingQuiz

          ?

          <div>
            <h1>Select a quiz!</h1>
            <div className="row list-group">
              {this.state.quizNames.map((test, i) =>
                <button
                  onClick={() => this.handleSelect(test[1])}
                  type="button"
                  key={i}
                  className={`list-group-item ${this.state.selectedQuiz === test[1] ? 'list-group-item-success' : ''}`}>
                  {test[0]}
                  <span
                    onClick={() => this.handleDelete(test[1])}
                    className="glyphicon glyphicon-trash pull-right">
                  </span>
                </button>)}
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.startQuiz.bind(this)}>Take Quiz
            </button>
          </div>

          :

          <div>
            <h1>{this.state.name}</h1>
            {/* animations for buttons */}
            <VelocityTransitionGroup
              enter={{
                animation: 'transition.slideDownBigOut',
                duration: 20000,
                opacity: [1, 1],
                translateY: 200
              }}
              leave={{opacity: [1, 1]}}
            >
              {this.state.randomAnswers.map(option => <button onClick={this.handleClick.bind(this)} className={`answer btn btn-lg ${option}`}>{option}</button> )}
            </VelocityTransitionGroup>

            <div className="container"></div>
            {
              this.state.showTimer ? <h2>{this.state.timeCount}</h2> : null
            }
            <div id='ground'></div>
          </div>
      }
      </div>
    );
  }
}
