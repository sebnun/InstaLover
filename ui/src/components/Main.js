import React, { Component } from 'react';
import { Button, Callout, Intent } from "@blueprintjs/core";

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Main extends Component {

  constructor(props) {
    super(props)

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  handleLogoutClick() {
    ipcRenderer.send('logout-message', { })
    this.props.updateLoginStatus(false)
  }
    render() {
      return (
        <div style={{
          padding: '20px'
      }}>

          
          <Callout intent={Intent.PRIMARY} title="InstaTraffic is running" style={{marginTop: '20px'}}>
          <ul>
            <li>Now the app will start liking photos on your behalf.</li>
            <li>Just keep using your Mac as usual with the app running.</li>
            
            </ul>
          </Callout>
          <Button text="Logout" className="pt-large pt-fill" onClick={this.handleLogoutClick} style={{ marginTop: '20px' }} />
          
      </div>
      );
    }
  }
  
  export default Main;