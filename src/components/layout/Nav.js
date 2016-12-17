import React from 'react';
import { Link } from 'react-router';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    console.log('NAV PROPS', this.props);
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
                <li><Link to="/settings" onClick={this.toggleCollapse.bind(this)}>Settings</Link></li>
                <li><Link to="/prebuiltQuiz">PreBuilt Quiz</Link></li>
                <li><Link to="/customQuiz">Custom Quiz</Link></li>
                <li><a href="/auth/signout">Log Out</a></li>
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
