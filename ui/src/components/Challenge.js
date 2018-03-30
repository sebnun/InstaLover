import React, { Component } from 'react';
import { Button, Input, message } from 'antd'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Challenge extends Component {

  constructor(props) {
    super(props)

    this.state = { step: 1 }

    this.handleEmailClick = this.handleEmailClick.bind(this)
    this.handleTextClick = this.handleTextClick.bind(this)
    this.handleNewCode = this.handleNewCode.bind(this)
    this.handleStartOver = this.handleStartOver.bind(this)
    this.handleVerifyClick = this.handleVerifyClick.bind(this)
  }

  handleEmailClick() {
    this.setState({ step: 1 })
  }

  handleTextClick() {
    this.setState({ step: 1 })
  }

  handleStartOver() {
    this.setState({ step: 0})
  }

  handleNewCode() {
    message.info('New verification code sent!')
  }

  handleVerifyClick() {
    this.props.updateCurrentScreen('main')
  }

  render() {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>

        {this.state.step === 0 ?
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
            <p>You need to verify your Instagram first</p>

            <Button style={formItemStyle} onClick={this.handleEmailClick} type="primary">Send email to asd@*****.com</Button>
            <Button style={formItemStyle} onClick={this.handleTextClick} type="primary">Send text message to +598***789</Button>

          </div>
          :
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
              <p>Enter the code to verify your Instagram</p>
              <Input placeholder="Code" style={{ ...formItemStyle, width: '40%' }} />
              <Button type="primary" style={{...formItemStyle, width: '140px'}} onClick={this.handleVerifyClick}>Verify</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Button style={{...formItemStyle, width: '140px'}} onClick={this.handleStartOver}>Start over</Button>
              <Button style={{...formItemStyle, width: '140px'}} onClick={this.handleNewCode}>Send new code</Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

const formItemStyle = {
  marginTop: '10px',
  marginBottom: '10px'
}

export default Challenge;