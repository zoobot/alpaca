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
      createdBy: ''
    };
  }

  componentDidMount() {
    this.getAuthorName();
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

  handleSave() {
    // API call to save test to database for user.
    // Test ID is located at this.state.testId
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
            <p>Question #1</p>
            <p>Question #2</p>
            <p>Question #3</p>
            <p>...</p>
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
