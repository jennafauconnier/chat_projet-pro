import React, { Component } from 'react';
import { connect } from 'react-redux';
import RoomCreation from '../RoomCreation';
import Rooms from '../Rooms';
import Layout from '../Layout';
// import { Link } from 'react-router-dom';
import './Home.scss';

class Home extends Component {
  state = {
    users: [],
  };

  createRoom = roomName => {
    fetch('http://localhost:4332/rooms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`,
      },
      body: JSON.stringify({
        name: roomName,
      }),
    }).then(async res => {
      const room = await res.json();
      this.props.history.push(`/room/${room.id}`);
    });
  };

  render() {
    return (
      <Layout>
        <p className="Home_message">Welcome Here :)</p>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({ token: state.token });

export default connect(mapStateToProps)(Home);
