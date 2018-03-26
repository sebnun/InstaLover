import React, { Component } from 'react';
import { Button, Callout, Intent } from "@blueprintjs/core";

class Main extends Component {

  constructor(props) {
    super(props)

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  handleLogoutClick() {
    //actual logout here
    this.props.updateLoginStatus(false)
  }
    render() {
      return (
        <div style={{
          padding: '20px'
      }}>

          
          <Callout intent={Intent.PRIMARY} title="Instatraffic is running" style={{marginTop: '20px'}}>
          <ul>
            <li>Now the app will visit orher profiles and start linikm</li>
            <li>Theres no need to keep your mac open 24/7, the app will simulate a real human so no at night</li>
            <li>it will gradually increase the likes per day</li>
            
            </ul>
          </Callout>
          <Button text="Logout" className="pt-large pt-fill" onClick={this.handleLogoutClick} style={{ marginTop: '20px' }} />
          
      </div>
      );
    }
  }
  
  export default Main;