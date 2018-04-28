import React, { Component } from 'react';
import { Button, message } from 'antd'

const { inAppPurchase } = window.require('electron').remote

// const electron = window.require('electron');
// const ipcRenderer = electron.ipcRenderer;

class Shop extends Component {
  constructor(props) {
    super(props)

    this.handleGoToMain = this.handleGoToMain.bind(this)
    this.handleFirstButton = this.handleFirstButton.bind(this)
    this.handleThirdButton = this.handleThirdButton.bind(this)
    this.handleFourthButton = this.handleFourthButton.bind(this)
  }

  componentDidMount() {
    if (!inAppPurchase.canMakePayments()) {
      message.error(`It seems you can't make purchases.`)
    }
  }

  handleGoToMain() {
    this.props.updateCurrentScreen('main')
  }

  handleFirstButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 5000}`)
    inAppPurchase.purchaseProduct('5000')
  }

  handleSecondButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 10000}`)
    inAppPurchase.purchaseProduct('10000')
  }

  handleThirdButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 20000}`)
    inAppPurchase.purchaseProduct('20000')
  }

  handleFourthButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 50000}`)
    inAppPurchase.purchaseProduct('50000')
  }

  render() {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '45px' }}>
          <Button shape="circle" icon="arrow-left" onClick={this.handleGoToMain} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>

          <Button style={formItemStyle} type="primary" onClick={this.handleFirstButton}>Buy 5000 credits</Button>
          <Button style={formItemStyle} type="primary" onClick={this.handleSecondButton}>Buy 10000 credits</Button>
          <Button style={formItemStyle} type="primary" onClick={this.handleThirdButton}>Buy 20000 credits</Button>
          <Button style={formItemStyle} type="primary" onClick={this.handleFourthButton}>Buy 50000 credits</Button>
        </div>

      </div>
    );
  }
}

const formItemStyle = {
  marginTop: '15px',
  marginBottom: '15px'
}

export default Shop;