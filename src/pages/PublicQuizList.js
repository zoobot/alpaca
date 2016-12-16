import React from 'react';
import axios from 'axios';

export default class PublicQuizList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizNames: []
    };
  }

  componentDidMount() {
    this.getQuizes();
  }

  // get all quizzes from server
  getQuizes() {
    axios.get('/questions')
      .then(response => {
        console.log(response);
        var entries = response.data;
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

  handleSave(id) {
    // API call to save test to database for user.
  }

  render() {
    return (
      <div className="App">
        <h1>Public Quizzes</h1>
        <div className="row list-group">
        {this.state.quizNames.map((test, i) =>
        <button
          onClick={() => this.handleSelect(test[1])}
          type="button"
          key={i}
          className="list-group-item">
          {test[0]}
          <span
            onClick={() => this.handleSave(test[1])}
            className="glyphicon glyphicon-floppy-disk pull-right">
          </span>
        </button>)}
        </div>
      </div>
    );
  }
}
