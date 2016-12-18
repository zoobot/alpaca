import React from 'react';
import { Link } from 'react-router';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      time: new Date()
    };
  }
  greeting(time) {
    let timeOfDay = {
      noon: new Date().setHours(12, 0, 0),
      evening: new Date().setHours(17, 0, 0)
    };
    if (time < timeOfDay.noon) {
      return 'morning';
    } else if (time < timeOfDay.evening) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const navClass = collapsed ? 'collapse' : '';

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">CrashCourse</a>
          </div>
          <div className={'navbar-collapse ' + navClass} id="bs-example-navbar-collapse-1">
            { this.props.user ? (
              <ul className="nav navbar-nav navbar-right">
                <li><Link to="/prebuiltQuiz" onClick={this.toggleCollapse.bind(this)}>Quizzes</Link></li>
                <li><Link to="/publicQuizzes">Public Quizzes</Link></li>
                <li><Link to="/groupQuiz">Group Quizzes</Link></li>
                <li><Link to="/customQuiz">Build Quiz</Link></li>
                <li><a href="/auth/signout">Log Out</a></li>
                <li><Link to="/settings">Good {this.greeting(this.state.time)} {this.props.user.firstname.replace(/\b\w/g, l => l.toUpperCase())}!</Link></li>
              </ul>
            ) : (
              <ul className="nav navbar-nav navbar-right">
                <li><Link to="/login" onClick={this.toggleCollapse.bind(this)}>Log In</Link></li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    );
  }
}
