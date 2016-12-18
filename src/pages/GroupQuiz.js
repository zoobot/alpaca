import React from 'react';
import PrebuiltQuiz from './PrebuiltQuiz';
// import socket from 'socket.io-client'
// import axios from 'axios';

export default class GroupQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      group: true,
      room: 'Penquiz Challenge',
      currentQuiz: null,
      started: false,
      showQuiz: false
    };
    this.handleChangeRoom = this.handleChangeRoom.bind(this);
  }
  componentWillMount() {
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

  handleChangeRoom(e) {
    this.setState({[e.target.name]: e.target.value});
  }
  handleChangeQuiz(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleChangeQuiz(e) {
    this.setState({showQuiz: !this.state.showQuiz});
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

  render() {
    return (
      <div>
      <form className="form-joinquiz joinquiz">
        <div className="form-group row">

            <label className="col-xs-4 col-form-label" htmlFor="room">Room Name: </label>
            <div className="col-xs-8">
              <h1> {this.state.room}</h1>
              <label className="col-xs-4 col-form-label" htmlFor="room">Room Name: </label>
                <input name="room" type="text" ref="room" className="form-control" placeholder="Room Name" onChange={this.handleChangeRoom.bind(this)}></input>
              <label className="col-xs-4 col-form-label" htmlFor="quizName">Quiz Name: </label>
                <input name="quizName" type="text" ref="quizName" className="form-control" placeholder="quizName" onChange={this.handleChangeQuiz.bind(this)}></input>

                {this.state.showQuiz ? <PrebuiltQuiz className="quizName" quiz={this.state.currentQuiz}  emitQuizUs={this.emitQuizUs} emitLoadUrl={this.emitLoadUrl} started={this.state.started} currentQuiz={this.state.url} /> : null}

              <button className="btn btn-sm btn-primary" placeholder="Room Name"  name="room" ref="room" type="button" onClick={this.state.showQuiz}>START</button>

            </div>

        </div>
        </form>

      </div>
    );
  }
}

