import React from 'react';
import { Link } from 'react-router';

import Footer from '../components/layout/Footer';
import Nav from '../components/layout/Nav';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    };
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(data) {
    this.setState({ user: data });
    console.log('USER UPDATED');
  }

  render() {
    const childrenProps = React.cloneElement(this.props.children, {updateUser: this.updateUser});
    console.log('LAYOUT STATE', this.state);
    const { location } = this.props;
    const containerStyle = {
      marginTop: '60px'
    };
    return (
      <div>
        <Nav location={location} user={this.state.user} />
        <div className="container" style={containerStyle}>
          <div className="row">
            {childrenProps}
          </div>
        </div>
         <Footer/>
      </div>
    );
  }
}
