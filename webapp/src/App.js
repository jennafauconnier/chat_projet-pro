import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Home from './components/Home';
import Room from './components/Room';
import PrivateRoom from './components/PrivateRoom';
import { connectSocket, disconnectSocket } from './services/socket';

//Route me permet d'afficher le composant lorsque la route route / est appelé.

class App extends Component {
  handleSocketConnection(token) {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }

  componentDidMount() {
    this.handleSocketConnection(this.props.token);
  }

  componentDidUpdate(prevProps) {
    if (this.props.token === prevProps.token) return;

    this.handleSocketConnection(this.props.token);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/room/:roomName" component={Room} />
          <Route path="/room/:roomName/messages" component={PrivateRoom} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(App);
