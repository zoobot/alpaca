import React from 'react';
import axios from 'axios';
import {Popover, Tooltip, Modal, Button, OverlayTrigger} from 'react-bootstrap';

export default class PublicQuizItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      testId: this.props.data.id,
      quizName: this.props.data.test,
      category: this.props.data.category,
      createdBy: '',
      questions: []
    };
  }

  componentDidMount() {
    this.getAuthorName();
    this.getQuizQuestions();
  }

  getAuthorName() {
    axios.get('/user', {
      params: {
        id: this.props.data.userId
      }
    }).then(name => {
      this.setState({
        createdBy: name.data
      });
    });
  }

  getQuizQuestions() {
    axios.get('/questions', {
      params: {
        testId: this.state.testId
      }
    }).then(questions => {
      this.setState({
        questions: questions.data
      });
    });
  }

  handleSave() {
    axios.post('/saveQuiz', {
      testId: this.state.testId
    }).then(console.log);
  }

  close() {
    this.setState({
      showModal: false
    });
  }

  open() {
    this.setState({
      showModal: true
    });
  }

  render() {
    return (
      <div>
        <button
          type="button"
          className="list-group-item"
          onClick={this.open.bind(this)}>{this.state.quizName}
        </button>

        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.quizName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Author</h4>
            <p>{this.state.createdBy}</p>
            <h4>Questions</h4>
            {this.state.questions.map(question => <p>{question.name}</p>)}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.handleSave.bind(this)}>Save</Button>
            <Button onClick={this.close.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
