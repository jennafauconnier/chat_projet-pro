import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Rooms from '../Rooms';
import RoomCreation from '../RoomCreation';

import './Layout.scss';

class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <div className="Layout_sidebar">
          <RoomCreation />
          <Rooms className="Layout_rooms" />
          <Link className="Layout_logout" to="/login">
            Log out
          </Link>
        </div>
        <div className="Layout_main">{this.props.children}</div>
      </div>
    );
  }
}

export default Layout;
