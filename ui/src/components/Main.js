import React, { Component } from 'react';
import { Button, Progress, Checkbox } from 'antd'
import Ionicon from 'react-ionicons'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Main extends Component {

  constructor(props) {
    super(props)

    this.state = { credits: this.props.credits, workingHours: false, blocked: this.props.blockedDate ? true : false }

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
    this.handleShopClick = this.handleShopClick.bind(this)
    this.handleSleepChange = this.handleSleepChange.bind(this)
    this.handleRunReply = this.handleRunReply.bind(this)
    this.run = this.run.bind(this)

  }

  componentDidMount() {
    this.intervalId = setInterval(this.run, 3000)
    this.run() //to set initial state
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  handleLogoutClick() {
    ipcRenderer.send('logout-message', {})
    this.props.updateCurrentScreen('login')
  }

  handleShopClick() {
    this.props.updateCurrentScreen('shop')
  }

  handleSleepChange() {
    this.setState((prevState) => {
      if (!prevState.sleep === true) {
        ipcRenderer.send('dontPreventSleep-message', {})
      } else if (!prevState.sleep === false) {
        ipcRenderer.send('preventSleep-message', {})
      }

      return { sleep: !prevState.sleep };
    });
  }

  render() {
    let mainContent = <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
      <Ionicon icon="md-heart" fontSize="75px" color="red" beat={true} style={{ margin: '20px' }} />
      <p>InstaTraffic is working</p>
    </div>

    if (this.state.credits === 0) {
      mainContent = <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
        <Ionicon icon="md-alert" fontSize="75px" color="grey" style={{ margin: '20px' }} />
        <p>Add credits for the app to keep working</p>
      </div>
    } else if (this.state.blocked) {
      mainContent = <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
        <Ionicon icon="md-alert" fontSize="75px" color="grey" style={{ margin: '20px' }} />
        <p>Blocked temporarily, resuming in a couple of hours</p>
      </div>
    } else if (!this.state.workingHours) {
      mainContent = <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
        <Ionicon icon="md-cloudy-night" fontSize="75px" color="grey" style={{ margin: '20px' }} />
        <p>Done working for now, will continue in a couple of hours</p>
      </div>
    }

    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Button shape="circle" icon="plus" onClick={this.handleShopClick} />
          <Progress width={50} type="circle" percent={45} format={percent => `${percent}`} />
          <Button shape="circle" icon="poweroff" onClick={this.handleLogoutClick} />
        </div>

        {mainContent}

        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
          <Checkbox onChange={this.handleSleepChange} checked={!this.state.sleep} >Don't sleep until Instalover is done for the day</Checkbox>
        </div>
      </div>
    );
  }

  run() {
    const credits = +localStorage.getItem('credits')
    this.setState({ credits })
    if (credits <= 0) return

    const currentTimestamp = + new Date()
    if (this.state.blocked) {
      const blockedDate = localStorage.getItem('blockedDate')
      const blockedTimestamp = + new Date(blockedDate)
      if ((currentTimestamp - blockedTimestamp) > 43200000) { //12h
        this.setState({ blocked: false })
        localStorage.removeItem('blockedDate')
      } else {
        return
      }
    }

    const currentDate = new Date()
    if (currentDate.getHours() < 8) { // from 8 to 23:59 can run
      this.setState({ workingHours: false })
      return
    } else {
      this.setState({ workingHours: true })
    }

    ipcRenderer.send('run-message', { })
  }

  handleRunReply(event, result) {
    //can also result 'no locations, just ignore
    if (result.message === 'blocked') {
      localStorage.setItem('blockedDate', result.date)
      localStorage.setItem('credits', `${this.state.credits - result.likeCount}`)
      this.setState((prevState) => { 
        return { blocked: true, credits: prevState.credits - result.likeCount }
      })
    } else if (result.message === 'ok') {
      localStorage.setItem('credits', `${this.state.credits - result.likeCount}`)
      this.setState((prevState) => { 
        return { credits: prevState.credits - result.likeCount }
      })
    }
  }
}

export default Main;