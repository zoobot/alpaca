import React from 'react';
import axios from 'axios';
import PublicQuizItem from './PublicQuizItem';
import { ButtonGroup, ListGroup, Panel } from 'react-bootstrap';

export default class PublicQuizList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizNames: {},
      categories: []
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getQuizes();
  }

  getCategories() {
    axios.get('/categories')
      .then(response => {
        this.setState({
          categories: response.data
        });
      });
  }

  getQuizes() {
    axios.get('/quizzes/public')
      .then(response => {
        var temp = {};
        this.state.categories.map(category => temp[category] = []);
        response.data.map(test => temp[test.category].push(test));
        this.setState({
          quizNames: temp
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
        {this.state.categories.map((category, i) => {
          return (
            <Panel collapsible header={category} key={i}>
              {
                this.state.quizNames[category]
                ?
                this.state.quizNames[category].map((test, i) =>
                  <PublicQuizItem fill key={i} data={test}/>)
                :
                null
              }
            </Panel>
          );
        })}
      </div>
    );
  }
}
