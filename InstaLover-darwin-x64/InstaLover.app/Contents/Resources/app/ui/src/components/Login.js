import React, { Component } from 'react';
import { message, Button, Icon, Input } from 'antd'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = { user: '', password: '', loading: false }

        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        this.handleLoginClick = this.handleLoginClick.bind(this)
        this.handleLoginReply = this.handleLoginReply.bind(this)
    }

    componentDidMount() {
        ipcRenderer.on('login-reply', this.handleLoginReply)
    }

    handleLoginReply(event, result) {
        this.setState({ loading: false })
        
        if (result === 'ok') {
            this.props.updateCurrentScreen('main')
        } else if (result === 'error') {
            message.error(`Can't login, check your username and password`)
        } else if (result === 'offline') {
            message.error(`Can't login, check your internet connection`)
        } else { //result is an object with url, email and phone
            this.props.updateCurrentScreen('challenge', result.url, result.email, result.phone)
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
            message.warning(`Username or Password can't be empty`);
        } else {
            this.setState({ loading: true })
            ipcRenderer.send('login-message', { user: this.state.user, password: this.state.password })
        }
    }

    render() {
        return (
            <div style={{padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap'}}>
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Instagram Username" style={formItemStyle} onChange={this.handleUserChange} />

                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Instagram Password" style={formItemStyle} onChange={this.handlePasswordChange} />

                <p style={{...formItemStyle, textAlign: 'center'}}>Your log in information will not be saved</p>
                
                <Button type="primary" style={{...formItemStyle, margin: 'auto'}} onClick={this.handleLoginClick} loading={this.state.loading}>Log in</Button>
            </div>);
    }
}

const formItemStyle = {
    marginTop: '10px',
    marginBottom: '10px'
}

export default Login;