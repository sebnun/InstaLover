import React, { Component } from 'react';
import { Button, Toast, Intent } from "@blueprintjs/core";

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = { user: '', password: '', toast: false, message: '' }

        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        this.handleLoginClick = this.handleLoginClick.bind(this)
        this.handleToastDismiss = this.handleToastDismiss.bind(this)
        this.handleLoginReply = this.handleLoginReply.bind(this)
    }

    componentDidMount() {
        ipcRenderer.on('login-reply', this.handleLoginReply)
    }

    handleLoginReply(event, result) {
        if (result === 'ok') {
            this.props.updateLoginStatus(true)
        } else if (result === 'error') {
            this.setState({ toast: true, message: "Can't login, check your username and password" })
        } else if (result === 'offline') {
            this.setState({ toast: true, message: "Can't login, check your internet connection" })
        }
    }

    handleUserChange(event) {
        this.setState({ user: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleLoginClick(event) {
        if (!this.state.user || !this.state.password) {
            this.setState({ toast: true, message: "User or Password can't be empty" })
        } else {
            ipcRenderer.send('login-message', { user: this.state.user, password: this.state.password })
        }
    }

    handleToastDismiss() {
        this.setState({ toast: false })
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

                <input className="pt-input pt-large pt-fill" type="text" placeholder="Username" onChange={this.handleUserChange} />
                <input className="pt-input pt-large pt-fill" type="text" placeholder="Password" onChange={this.handlePasswordChange} style={{ marginTop: '20px' }} />
                <Button text="Login to Instagram" className="pt-large pt-fill" onClick={this.handleLoginClick} style={{ marginTop: '20px' }} />
                {this.state.toast ? <Toast message={this.state.message} onDismiss={this.handleToastDismiss} intent={Intent.WARNING} /> : null}

            </div>
        );
    }
}

export default Login;