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
      playing: false,
      showQuiz: false
    };
    this.handleChange = this.handleChange.bind(this);

  }
  componentDidMount() {
    var self = this;
    socket.emit( 'join', self.state.room );
    socket.on('loadUrl', function(data){
      console.log('url loaded on clientside');
      self.setState({ url : data });
    });

    socket.on('startQuiz', function(){
      console.log('quiz started on clientside');
      self.setState({ playing: !self.state.playing });
    });
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  emitRoomName(room){
    console.log('room name emit triggered');
    socket.emit('createRoom', {room});
    console.log('this is the room', room);
  }

  emitPlayPause() {
    socket.emit('playPause');
    console.log('playPause emitted from client-side!');
  }

  emitLoadUrl(url) {
    console.log('clientemit triggered');
    socket.emit('URL', {url});
    console.log(url);
  }

  // componentDidUpdate() {

  // }

  render() {
    return (
      <div>
      <h1> {this.state.room}</h1>
      <form className="form-joinquiz joinquiz">
        <div className="form-group row">
          <label className="col-xs-4 col-form-label" htmlFor="room">Enter the room you wish to join</label>
          <div className="col-xs-8">
            <input name="room" type="text" ref="room" className="form-control" placeholder="Room Name" onChange={this.handleChange.bind(this)}></input>
          </div>
        </div>

        <button className="btn btn-sm btn-primary" type="button" onClick={this.emitPlayPause.bind(this)}>Join Room</button>
        </form>
      </div>
    );
  }
}

