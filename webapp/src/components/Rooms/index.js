import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Rooms.scss';

class Rooms extends Component {
  state = {
    rooms: [],
  };

  async componentDidMount() {
    const res = await fetch('http://localhost:4332/rooms', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`,
      },
    });
    const { rooms } = await res.json();
    this.setState({ rooms });
  }

  joinRoom = roomId => {
    fetch(`http://localhost:4332/rooms/${roomId}/join`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`,
      },
    }).then(() => {
      this.props.history.push(`/room/${roomId}`);
    });
  };

  render() {
    return (
      <ul className="Rooms">
        {this.state.rooms.map(room => {
          return (
            <li key={room.id} className="Rooms_item">
              <button
                className="Rooms_button"
                type="button"
                onClick={() => this.joinRoom(room.id)}
              >
                {room.name}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }
}

const mapStateToProps = state => ({ token: state.token });

export default connect(mapStateToProps)(withRouter(Rooms));
