import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToken } from '../../redux/actions';
import './SignIn.scss';


class SignIn extends Component {
  state = {
    username : '',
    password : '',
  }

  checkLocalStorage = () => {
    const username = localStorage.getItem("username");
    if (username) {
      this.setState({ username });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  postSignIn = (event) => {
    event.preventDefault()
    const { username, password } = this.state
    const body = JSON.stringify({ username, password })
    const headers = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
    fetch('http://localhost:4332/users/signin', {
      method : 'POST',
      headers,
      body
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Invalid credentials');
      }
      return res.json();
    })
    .then(data => {
      this.props.setToken(data.token)
      this.props.onSuccess(data);
    })
    .catch(err => window.alert(err))
  }

  render() {
    return(
      <div className="sign-in_content">
        <div className="sign-in_title">
            <h2>Sign in</h2>
        </div>
        <form className="sign-in_form" onSubmit={this.postSignIn}>
            <div className="sign-in_form-element sign-in_form-username">
                <input type="text" name="username" required placeholder="Username" value={this.state.username} onChange={this.handleChange}></input>
            </div>
            <div className="sign-in_form-element sign-in_form-password">
                <input type="password" name="password" required placeholder="Password" value={this.state.password} onChange={this.handleChange}></input>
            </div>
            <div className="sign-in_button">
              <button className="sign-in_submit" value="Signin" type="submit">Sign in</button>
            </div>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setToken: setToken,
}

export default connect(undefined, mapDispatchToProps)(SignIn);