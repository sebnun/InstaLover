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

    this.state = { currentScreen: 'challenge' }
    this.updateCurrentScreen = this.updateCurrentScreen.bind(this)
  }

  updateCurrentScreen(value) {
    this.setState({ currentScreen: value })
  }

  render() {
    let currentScreen = <Login updateCurrentScreen={this.updateCurrentScreen} />
    if (this.state.currentScreen === 'main') {
      currentScreen = <Main updateCurrentScreen={this.updateCurrentScreen} />
    } else if (this.state.currentScreen === 'shop') {
      currentScreen = <Shop updateCurrentScreen={this.updateCurrentScreen} />
    } else if (this.state.currentScreen === 'challenge') {
      currentScreen = <Challenge updateCurrentScreen={this.updateCurrentScreen} />
    }   

    return (
      <div className="App">
        {currentScreen}
      </div>
    );
  }
}

export default App;
