import React, { Component } from 'react';
import { Button, Input, message } from 'antd'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Challenge extends Component {

  constructor(props) {
    super(props)

    this.state = { step: 0, code: '', loading: false }

    this.handleEmailClick = this.handleEmailClick.bind(this)
    this.handleTextClick = this.handleTextClick.bind(this)
    this.handleNewCode = this.handleNewCode.bind(this)
    this.handleStartOver = this.handleStartOver.bind(this)
    this.handleVerifyClick = this.handleVerifyClick.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.handleChallengeCodeReply = this.handleChallengeCodeReply.bind(this)
  }

  componentDidMount() {
    ipcRenderer.on('updateChallengeCode-reply', this.handleChallengeCodeReply)
  }

  handleChallengeCodeReply(event, success) {
    this.setState({ loading: false })

    if (success) {
      this.props.updateCurrentScreen('main')
    } else {
      ipcRenderer.send('resetChallenge-message', { challengeUrl: this.props.url })
      this.setState({ step: 0, code: '' })
      message.error(`Couldn't verify the code, try again`)
    }
  }

  handleEmailClick() {
    //no need to check for errors?
    ipcRenderer.send('updateChallenge-message', { challengeUrl: this.props.url, choice: 1 })
    this.setState({ step: 1 })
  }

  handleTextClick() {
        //no need to check for errors?
        ipcRenderer.send('updateChallenge-message', { challengeUrl: this.props.url, choice: 0 })
        this.setState({ step: 1 })
  }

  handleStartOver() {
    //no need to check for errors?
    ipcRenderer.send('resetChallenge-message', { challengeUrl: this.props.url })
    this.setState({ step: 0})
  }

  handleNewCode() {
    //no need to check for errors?
    ipcRenderer.send('replayChallenge-message', { challengeUrl: this.props.url })
    message.info('New verification code sent!')
  }

  handleVerifyClick() {
    this.setState({ loading: true })
    ipcRenderer.send('updateChallengeCode-message', { challengeUrl: this.props.url, securityCode: +this.state.code})
  }

  handleCodeChange(e) {
    this.setState({code: e.target.value})
  }

  render() {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>

        {this.state.step === 0 ?
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
            <p>You need to verify your Instagram first</p>

            {this.props.email && 
            <Button style={formItemStyle} onClick={this.handleEmailClick} type="primary">
              Send email to {this.props.email}
            </Button>
            }
            {this.props.phone && 
            <Button style={formItemStyle} onClick={this.handleTextClick} type="primary">
              Send text message to {this.props.phone}
            </Button>
            }

          </div>
          :
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
              <p>Enter the code to verify your Instagram</p>
              <Input placeholder="Code" style={{ ...formItemStyle, width: '40%' }} onChange={this.handleCodeChange} type="number"/>
              <Button type="primary" style={{...formItemStyle, width: '140px'}} onClick={this.handleVerifyClick} loading={this.state.loading}>Verify</Button>
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