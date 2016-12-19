import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

export default class Homepage extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      quizNames: []
    };
  }

  render() {
    console.log('homepage');
    return (
      <div className="container homepage">
        <div className="row text-center hero-section">
          <h1>CrashCourse</h1>
          <i className="fa fa-desktop"></i>
        </div>
        <div className="row main-content">
          <div className="col-md-4 text-left">
              <h2>What is CrashCourse?</h2>
              <p>Learning is life! It should be yours too. Crashcourse is the way, the path that will lead you to golden garden where you will find a secret box of prizes</p>
          </div>
          <div className="col-md-4 text-left">
              <h2>Why use CrashCourse?</h2>
              <p>I am a total potato lately. Because I am here taking the great crashcourse. Delightful? Yes. My mind has quizzes in it. Yours can too.</p>
          </div>
          <div className="col-md-4 text-left">
              <h2>Get started</h2>
              <p>Join me in the wonderful world of online learning. Do not go outside right now. Please. Just stay here for a long  long time.</p>
              <Link to="/signup">Sign Up Now</Link>
          </div>
        </div>

      </div>
    );
  }
}
