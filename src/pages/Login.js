import React from 'react';
import axios from 'axios';
import { Link, hashHistory } from 'react-router';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  sendCredentials() {
    let userUpdate = this.props.updateUser;
    axios.post('/auth/login', {
      username: this.state.username,
      password: this.state.password,
    })
    .then(function(result) {
      userUpdate(result.data);
      hashHistory.push('/prebuiltQuiz');
    })
    .catch(function(err) {
      console.error('ERROR', err);
    });
  }

  checkUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  checkPassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  render() {
    return (
      <div className="container main-login-container">
        <div className="col-md-4 col-md-offset-4">
          <h1>Log In</h1>
          <form className="form-signin login">
            <div className="form-group row">
              <label htmlFor="username" className="col-xs-4 col-form-label">Email</label>
              <div className="col-xs-8">
                <input type="email" className="form-control" id="email" placeholder="Email" onChange={this.checkUsername.bind(this)}></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="password" className="col-xs-4 col-form-label">Password</label>
              <div className="col-xs-8">
                <input type="text" className="form-control" id="password" type="password" placeholder="Password" onChange={this.checkPassword.bind(this)}></input>
              </div>
            </div>
            <button className="btn btn-sm btn-primary" type="button" onClick={this.sendCredentials.bind(this)}>Log In</button>
          </form>
          <div className="row text-center">
            <small>Don't have an account?<Link to="/signup"> Sign Up</Link></small>
          </div>
        </div>
      </div>
    );
  }
}
