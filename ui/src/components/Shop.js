import React, { Component } from 'react';
import { Button, message } from 'antd'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Shop extends Component {

  constructor(props) {
    super(props)

    this.handleGoToMain = this.handleGoToMain.bind(this)
    this.handleFirstButton = this.handleFirstButton.bind(this)
    this.handleThirdButton = this.handleThirdButton.bind(this)
  }

  handleGoToMain() {
    this.props.updateCurrentScreen('main')
  }

  handleFirstButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', credits + 1000)
    message.info('1000 credits added!')
  }

  handleSecondButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', credits + 2000)
    message.info('2000 credits added!')
  }

  handleThirdButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', credits + 3000)
    message.info('3000 credits added!')
  }

  render() {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Button shape="circle" icon="arrow-left" onClick={this.handleGoToMain} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>

        <Button style={formItemStyle} type="primary" onClick={this.handleFirstButton}>Buy 100 credits</Button>
        <Button style={formItemStyle} type="primary" onClick={this.handleSecondButton}>Buy 500 credits</Button>
        <Button style={formItemStyle} type="primary" onClick={this.handleThirdButton}>Buy 1000 credits</Button>
        <p>1 hour of work is 1 credit</p>
        </div>

      </div>
    );
  }
}

const formItemStyle = {
  marginTop: '10px',
  marginBottom: '10px'
}

export default Shop;