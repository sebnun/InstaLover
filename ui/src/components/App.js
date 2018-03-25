import React, { Component } from 'react';
import Login from './Login';
import Main from './Main';
//import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { user: window.localStorage.user, running: false }
    //if user === undefined is loggedout
    //remove user key when logging out
  }

  render() {
    return (
      <div className="App">
        {this.state.user ?
          <Main />
          : 
          <Login />}
      </div>
    );
  }
}

export default App;
