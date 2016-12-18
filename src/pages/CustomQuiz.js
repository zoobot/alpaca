import React from 'react';
import axios from 'axios';

export default class CustomQuiz extends React.Component {
  constructor(props) {
    super(props);

    //keep state
    this.state = {
      question: '',
      answer: '',
      option1: '',
      option2: '',
      option3: '',
      testName: '',
      currQuesList: []
    };

    this.clearForm = this.clearForm.bind(this);
  }

  // this actually pushes the current values to the server using a post request
  // with axios
  sendCustomTemplate(e) {
    axios.post('/questions', {
      name: this.state.question,
      correct: this.state.answer,
      wrong1: this.state.option1,
      wrong2: this.state.option2,
      wrong3: this.state.option3,
      testName: this.state.testName
    })
    .then((response) => {
      console.log('this is happening', response);
      this.clearForm();
    });
    //this.getTestNameCurrentQuestions();
  }

  clearForm() {
    this.refs.question.value = '';
    this.refs.correctAnswer.value = '';
    this.refs.wrong1.value = '';
    this.refs.wrong2.value = '';
    this.refs.wrong3.value = '';
  }

  // the next *handle* functions to the work of updating state variables as
  // data is typed into the input fields.
  handleQuestion(e) {
    this.setState({
      question: e.target.value
    });
  }

  handleCorrentAnswer(e) {
    this.setState({
      answer: e.target.value
    });
  }

  handleWrong1(e) {
    this.setState({
      option1: e.target.value
    });
  }

  handleWrong2(e) {
    this.setState({
      option2: e.target.value
    });
  }

  handleWrong3(e) {
    this.setState({
      option3: e.target.value
    });
  }

  // still handling input field text, but calling this.getTest..... to populate the
  // existing questions for the supplied test in the div to the right
  handleTestName(e) {
    this.setState({
      testName: e.target.value,
      currQuesList: [],
    }, this.getTestNameCurrentQuestions);
    console.log(this.state.testName);
  }

  // getTestNameCurrentQuestions() {
  //   var entries;
  //   var config = {
  //     params: {
  //       ID: this.state.testName
  //     }
  //   };

  //   axios.get('/questions', config)
  //     .then(response => {
  //       // console.log('line 75 custom quiz, res.body = ' + JSON.stringify(response.data, null, 2));
  //       entries = response.data;
  //       var temp = [];
  //       entries.forEach(entry => {
  //         temp.push(entry.name);
  //       });
  //       this.setState({
  //         currQuesList: temp,
  //       });
  //     })
  //     .catch(function(err) {
  //       console.error(err);
  //     });
  // }

  handleRemove(e) {
    // do something here that posts a delete request to server
    var tempName = e.target.textContent;
    this.setState({
      currQuesList: [],
    }, function() {
      axios.post('/questions', {
        delete: true,
        name: tempName,
      })
      .catch(function(err) {
        console.error(err);
      });
      this.getTestNameCurrentQuestions();
    });
  }

  render() {
    return (
      <div className="container customquiz">
        <div className="col-md-12">
          <div className='row'>
            <div className='col-md-6' >
              <h2>Build a Custom Quiz</h2>

              <form className="form-customquiz customquiz">
                <div className="form-group row">
                  <label className="col-xs-4 col-form-label" htmlFor="testName">Test Name</label>
                  <div className="col-xs-8">
                    <input name="testName" value={this.state.testName} type="text" className="form-control" placeholder="Enter the Name of this Test" onChange={this.handleTestName.bind(this)}></input>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-4 col-form-label" htmlFor="question">Question</label>
                  <div className="col-xs-8">
                    <input name="question" type="text" ref="question" className="form-control" placeholder="Enter a question" onChange={this.handleQuestion.bind(this)}></input>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-4 col-form-label" htmlFor="answer">Correct</label>
                  <div className="col-xs-8">
                    <input name="answer" type="text" ref="correctAnswer" className="form-control" placeholder="Enter an answer" onChange={this.handleCorrentAnswer.bind(this)}></input>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-4 col-form-label" htmlFor="option1">Wrong 1</label>
                  <div className="col-xs-8">
                    <input name="option1" type="text" ref="wrong1" className="form-control" placeholder="Enter an answer" onChange={this.handleWrong1.bind(this)}></input>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-4 col-form-label" htmlFor="option2">Wrong 2</label>
                  <div className="col-xs-8">
                    <input name="option2" type="text" ref="wrong2" className="form-control" placeholder="Enter an answer" onChange={this.handleWrong2.bind(this)}></input>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-4 col-form-label" htmlFor="option3">Wrong 3</label>
                  <div className="col-xs-8">
                    <input name="option3" type="text" ref="wrong3" className="form-control" placeholder="Enter an answer" onChange={this.handleWrong3.bind(this)}></input>
                  </div>
                </div>

                <button className="btn btn-sm btn-primary" type="button" onClick={this.sendCustomTemplate.bind(this)}>Submit Question</button>
              </form>
            </div>

            <div className='col-md-6'>
              <div>
                <h3>Click questions below to delete them once created!</h3>
                {this.state.currQuesList.map((option, i) =>
                  <button
                    key={i}
                    onClick={this.handleRemove.bind(this)}
                    className={`answer btn btn-lg ${option}`}>{option}
                  </button> )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
