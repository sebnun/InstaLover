import React, { Component } from 'react';
import { Button, InputNumber, Progress, Checkbox, Slider, Spin, Divider, Alert, Popover } from 'antd'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      //have to convert localstorage strings
      credits: +this.props.credits,
      seconds: +this.props.seconds,
      preventSleep: this.props.preventSleep === 'true' ? true : false,
      currentState: 'stopped' //working, nocredits, blocked, stopped
      //default stopped each time it loads this screen
    }

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
    this.handleShopClick = this.handleShopClick.bind(this)
    this.handleStartStopClick = this.handleStartStopClick.bind(this)
    this.handleSleepChange = this.handleSleepChange.bind(this)
    this.handleSecondsChange = this.handleSecondsChange.bind(this)

    this.handleRunReply = this.handleRunReply.bind(this)
    this.run = this.run.bind(this)

  }


  handleLogoutClick() {
    ipcRenderer.send('logout-message', {})
    this.props.updateCurrentScreen('login')
  }

  handleShopClick() {
    this.props.updateCurrentScreen('shop')
  }

  handleStartStopClick() {
    if (this.state.currentState === 'working') {
      this.setState({ currentState: 'stopped' })
      clearInterval(this.intervalId)
      //check for poweblocker validity is done on main thread
      ipcRenderer.send('stopPowerBlocker-message', { })
    } else {
      this.setState({ currentState: 'working' })

      if (this.state.preventSleep) {
        ipcRenderer.send('startPowerBlocker-message', { })
      }
      this.intervalId = setInterval(this.run, this.state.seconds * 1000)
      this.run()
    }
  }

  handleSecondsChange(seconds) {
    this.setState({ seconds })
    localStorage.setItem('seconds', seconds)
  }

  handleSleepChange() {
    this.setState((prevState) => {
      localStorage.setItem('preventSleep', (!prevState.preventSleep) ? 'true' : 'false')
      return { preventSleep: !prevState.preventSleep };
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    let feedback = <Alert
      message="Working"
      description="InstaLover is giving likes to other Instagram accounts"
      type="success"
      showIcon
      style={{ marginTop: '20px' }}
    />
    if (this.state.currentState === 'nocredits') {
      feedback = <Alert
        message="No credits"
        description="Add more credits for the app to continue working"
        type="info"
        showIcon
        style={{ marginTop: '20px' }}
      />
    } else if (this.state.currentState === 'blocked') {
      feedback = <Alert
        message="Temporarily blocked"
        description="Reduce the speed and try again in about 24 hours"
        type="error"
        showIcon
        style={{ marginTop: '20px' }}
      />
    } else if (this.state.currentState === 'stopped') {
      feedback = <Alert
        message="Stopped"
        description="Instalover is stopped, press the play button to start"
        type="info"
        showIcon
        style={{ marginTop: '20px' }}
      />
    }



    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Button shape="circle" icon="plus" onClick={this.handleShopClick} />

          <Button
            type="primary"
            shape="circle"
            icon={this.state.currentState === 'working' ? 'pause' : 'caret-right'}
            size="large"
            disabled={this.state.currentState === 'nocredits' ? true : false}
          />

          <Button shape="circle" icon="poweroff" onClick={this.handleLogoutClick} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>


          <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'baseline', marginTop: '20px' }}>
            <p style={{ width: '140px', textAlign: 'center' }}>Delay in seconds</p>
            <InputNumber value={this.state.seconds} min={1} max={999} onChange={this.handleSecondsChange} precision={0} />
            <p style={{ width: '140px', textAlign: 'center' }}>Lower is faster</p>
          </div>
          <Checkbox style={{ marginTop: '5px' }} onChange={this.handleSleepChange} checked={!this.state.preventSleep} >Prevent Mac from sleeping while working</Checkbox>

          {feedback}

          <p style={{ marginTop: '20px' }}>Credits remaining: {this.state.credits}</p>
          <Popover content={content}>
            <Button shape="circle" icon="info" />
          </Popover>

        </div>

      </div>
    );
  }

  run() {
    const credits = +localStorage.getItem('credits')
    this.setState({ credits })
    if (credits <= 0) {
      this.setState({ currentState: 'nocredits' })
      ipcRenderer.send('stopPowerBlocker-message', { })
      return
    }

    ipcRenderer.send('run-message', { })
  }

  handleRunReply(event, result) {
    //can also result 'no locations, just ignore
    if (result.message === 'blocked') {
      localStorage.setItem('credits', `${this.state.credits - result.likeCount}`)
      this.setState((prevState) => {
        return { currentState: 'blocked', credits: prevState.credits - result.likeCount }
      })
      ipcRenderer.send('stopPowerBlocker-message', { })
    } else if (result.message === 'ok') {
      localStorage.setItem('credits', `${this.state.credits - result.likeCount}`)
      this.setState((prevState) => {
        return { credits: prevState.credits - result.likeCount }
      })
    }
  }
}

const content = (
  <div>
    <p>Start with the default speed and don't use the app at night.</p>
    <p>Increase the speed slowly after each succeful day with no blocks</p>
    <p>If you get a block, decrease the speed and try again the next day</p>
    <p>Preventing sleep will allow your monitor to go sleep but not the app</p>

  </div>
);

export default Main;