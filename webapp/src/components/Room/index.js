import moment from 'moment';
import React, { Component } from 'react';
import { subscribe } from '../../services/socket';
import { connect } from 'react-redux';
import Layout from '../Layout';
import './Room.scss';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';

class Room extends Component {
  state = {
    message: '',
    messages: [],
    room: {},
  };

  componentDidUpdate(nextProps) {
    if (this.props.match.params.roomName !== nextProps.match.params.roomName) {
      this.setState({
        message: '',
        messages: [],
        room: {},
      });
      this.getMessages();
      this.getRoom();
    }
  }

  componentDidMount() {
    this.getMessages();
    this.getRoom();
    subscribe('MESSAGE', message => {
      if (String(message.room_id) !== String(this.props.match.params.roomName))
        return;
      this.setState({
        messages: this.state.messages.concat(message),
      });
    });
  }

  onMessageChange = e => {
    this.setState({ message: e.target.value });
  };

  addMessage = () => {
    const body = JSON.stringify({ message: this.state.message });
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.props.token}`,
    };
    fetch(
      `http://localhost:4332/rooms/${this.props.match.params.roomName}/messages`,
      {
        method: 'POST',
        headers,
        body,
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({ message: '' });
      })
      .catch(err => console.warn(err));
  };

  getRoom = () => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.props.token}`,
    };
    fetch(`http://localhost:4332/rooms/${this.props.match.params.roomName}`, {
      method: 'GET',
      headers,
    })
      .then(res => res.json())
      .then(room => {
        this.setState({
          room,
        });
      })
      .catch(err => console.warn(err));
  };

  getMessages = () => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.props.token}`,
    };
    fetch(
      `http://localhost:4332/rooms/${this.props.match.params.roomName}/messages`,
      {
        method: 'GET',
        headers,
      },
    )
      .then(res => res.json())
      .then(messages => {
        this.setState({
          messages,
        });
      })
      .catch(err => console.warn(err));
  };

  formatDate(date) {
    return moment(date).fromNow();
  }

  render() {
    return (
      <Layout>
        <div className="Room">
          <div className="Room_header">
            <h2>
              {this.state.room
                ? this.state.room.name
                : this.props.match.params.roomName}
            </h2>
            <p>{this.state.room ? this.state.room.usersCount : '-'} user(s)</p>
          </div>
          <ul className="Room_messages">
            {this.state.messages.map(message => {
              return (
                <li key={message.id}>
                  <div className="Room_user">
                    <strong>{message.username}</strong>
                    <i>{this.formatDate(message.date)}</i>
                  </div>
                  <p className="Room_text">{message.text}</p>
                </li>
              );
            })}
          </ul>
          <form
            className="Room_form"
            onSubmit={e => {
              e.preventDefault();
              this.addMessage(this.state.message);
            }}
          >
            <input
              className="Room_input"
              type="text"
              name="message"
              value={this.state.message}
              onChange={this.onMessageChange}
            ></input>
            <button className="Room_button" value="Envoyer" type="submit">
              <i className="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(Room);
