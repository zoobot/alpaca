import React from 'react';
import axios from 'axios';
import PublicQuizItem from './PublicQuizItem';
import {ButtonGroup} from 'react-bootstrap';

export default class PublicQuizList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizNames: [],
    };
  }

  componentDidMount() {
    this.getQuizes();
  }

  getQuizes() {
    axios.get('/questions')
      .then(response => {
        this.setState({
          quizNames: response.data
        });
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Public Quizzes</h1>
        <div className="row list-group">
            {this.state.quizNames.map((test, i) =>
              <PublicQuizItem key={i} data={test} />
            )}
        </div>
      </div>
    );
  }
}
{/*<button
          onClick={() => this.handleSelect(test[1])}
          type="button"
          key={i}
          className="list-group-item">
          {test[0]}
          <span
            onClick={() => this.handleSave(test[1])}
            className="glyphicon glyphicon-floppy-disk pull-right">
          </span>
        </button>*/}