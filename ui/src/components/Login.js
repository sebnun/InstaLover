import React, { Component } from 'react';
import { Button, Card, Toast, Intent } from "@blueprintjs/core";

const electron = window.require('electron');
const fs = electron.remote.require('fs');

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {user: '', password: '', toast: false, message: ''}

        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        this.handleLoginClick = this.handleLoginClick.bind(this)
        this.handleToastDismiss = this.handleToastDismiss.bind(this)
    }

    handleUserChange(event) {
        this.setState({user: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleLoginClick(event) {
        if (!this.state.user || !this.state.password) {
            this.setState({toast: true, message: "User or Password can't be empty"})
        } else {
            console.log(fs)
        }
    }

    handleToastDismiss() {
        this.setState({toast: false})
    }

    render() {
      return (
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              flexDirection: 'column',
              padding: '20px'
          }}>
            {/* <Card elevation={5} style={{
                margin: '20px',
                display:'flex',
                flexDirection: 'column'
                }}> */}
            <input className="pt-input pt-large pt-fill" type="text" placeholder="Username" onChange={this.handleUserChange}  />
            <input className="pt-input pt-large pt-fill" type="text" placeholder="Password" onChange={this.handlePasswordChange}  style={{ marginTop: '20px'}} />
            <Button text="Login to Instagram" className="pt-large pt-fill" onClick={this.handleLoginClick} style={{ marginTop: '20px'}} />
            {this.state.toast ? <Toast message={this.state.message} onDismiss={this.handleToastDismiss} intent={Intent.WARNING} /> : null}
          
          </div>
      );
    }
  }
  
  export default Login;