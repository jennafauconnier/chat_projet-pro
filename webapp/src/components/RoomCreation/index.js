import React, { Component } from 'react';
import './RoomCreation.scss';

class RoomCreation extends Component {
  state = {
    roomName: '',
  };

  setRoomName = e => {
    this.setState({ roomName: e.target.value });
  };

  onSubmit = () => {
    this.props.onRoomCreation(this.state.roomName);
  };

  render() {
    return (
      <div className="NewRoom">
        <label htmlFor="newRoom" className="NewRoom_label">
          Create a room
        </label>
        <form className="NewRoom_form" onSubmit={this.onSubmit}>
          <input
            type="text"
            id="newRoom"
            required
            placeholder="Room name"
            onChange={this.setRoomName}
            className="NewRoom_input"
          />
          <button className="NewRoom_button" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default RoomCreation;
