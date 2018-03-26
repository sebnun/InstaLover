import React, { Component } from 'react';
import Login from './Login';
import Main from './Main';
//import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    //KISS, login on every launch

    this.state = { loggedin: false }
    this.updateLoginStatus = this.updateLoginStatus.bind(this)
  }

  updateLoginStatus(value) {
    this.setState({ loggedin: value })
  }

  render() {
    return (
      <div className="App">
        {this.state.loggedin ?
          <Main updateLoginStatus={this.updateLoginStatus} />
          : 
          <Login updateLoginStatus={this.updateLoginStatus} />}
      </div>
    );
  }
}

export default App;
