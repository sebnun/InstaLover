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

    this.state = { currentScreen: 'main' }
    this.updateCurrentScreen = this.updateCurrentScreen.bind(this)
  }

  updateCurrentScreen(value, email, url, phone) {
    this.setState({ currentScreen: value, email, url, phone })
  }

  render() {
    //first run handling
    if (!localStorage.getItem('credits')) {
      localStorage.setItem('credits', '100000')
      localStorage.setItem('preventSleep', 'false')
      localStorage.setItem('seconds', '2000')
    }

    let currentScreen = <Login updateCurrentScreen={this.updateCurrentScreen} />
    if (this.state.currentScreen === 'main') {
      //get data
      currentScreen = <Main 
      updateCurrentScreen={this.updateCurrentScreen} 
      credits={localStorage.getItem('credits')}
      preventSleep={localStorage.getItem('preventSleep')}
      seconds={localStorage.getItem('seconds')}
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
