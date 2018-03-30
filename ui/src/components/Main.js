import React, { Component } from 'react';
import { Button, Progress } from 'antd'
import Ionicon from 'react-ionicons'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Main extends Component {

  constructor(props) {
    super(props)

    this.state = { credits: 1337, running: false }

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
    this.handleShopClick = this.handleShopClick.bind(this)
  }

  handleLogoutClick() {
    ipcRenderer.send('logout-message', {})
    this.props.updateCurrentScreen('login')
  }

  handleShopClick() {
    this.props.updateCurrentScreen('shop')
  }

  render() {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Button shape="circle" icon="plus" onClick={this.handleShopClick} />
          <Progress width={50} type="circle" percent={this.state.credits} format={percent => `${percent}`} />
          <Button shape="circle" icon="poweroff" onClick={this.handleLogoutClick} />
        </div>

        {this.state.running ?
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
            <Ionicon icon="md-heart" fontSize="100px" color="red" beat={true} style={{ margin: '20px' }} />
            <p>InstaTraffic is working</p>
          </div>
          :
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
            <Ionicon icon="md-cloudy-night" fontSize="100px" color="grey" style={{ margin: '20px' }} />
            <p>Done working for now, will continue tomorrow</p>
          </div>
        }
      </div>
    );
  }
}

export default Main;