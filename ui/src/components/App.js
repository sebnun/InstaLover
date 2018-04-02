import React, { Component } from 'react';

import Login from './Login';
import Main from './Main';
import Shop from './Shop';
import Challenge from './Challenge';
//import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    //KISS, login on every launch

    this.state = { currentScreen: 'login' }
    this.updateCurrentScreen = this.updateCurrentScreen.bind(this)
  }

  updateCurrentScreen(value, url, email, phone) {
    this.setState({ currentScreen: value, url, email, phone })
  }


  render() {
    //first run handling
    if (!localStorage.getItem('credits')) {
      localStorage.setItem('credits', '100000')
    }

    let currentScreen = <Login updateCurrentScreen={this.updateCurrentScreen} />
    if (this.state.currentScreen === 'main') {
      //get data
      currentScreen = <Main 
      updateCurrentScreen={this.updateCurrentScreen} 
      credits={localStorage.getItem('credits')}
      blockedDate={localStorage.getItem('blockedDate')}
      canIncreaseInterval={localStorage.getItem('canIncreaseInterval')}
      interval={localStorage.getItem('interval')}
      preventSleep={localStorage.getItem('preventSleep')}
      />
    } else if (this.state.currentScreen === 'shop') {
      currentScreen = <Shop updateCurrentScreen={this.updateCurrentScreen} />
    } else if (this.state.currentScreen === 'challenge') {
      currentScreen = <Challenge 
      updateCurrentScreen={this.updateCurrentScreen} 
      url={this.state.url} 
      phone={this.state.phone} 
      email={this.state.email} 
      />
    }   

    return (
      <div className="App">
        {currentScreen}
      </div>
    );
  }
}

export default App;
