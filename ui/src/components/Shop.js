import React, { Component } from 'react';
import { Button, message } from 'antd'

//const { inAppPurchase } = window.require('electron').remote

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Shop extends Component {

  constructor(props) {
    super(props)

    this.handleGoToMain = this.handleGoToMain.bind(this)
    this.handleFirstButton = this.handleFirstButton.bind(this)
    this.handleThirdButton = this.handleThirdButton.bind(this)
    this.handleFourthButton = this.handleFourthButton.bind(this)
  }

  componentDidMount() {
    ipcRenderer.send('test-message', { })
    // console.log(inAppPurchase.canMakePayments())
    // if (!inAppPurchase.canMakePayments()) {
    //   message.error(`It seems you're not allowed to make in-app purchase.`)
    // }

    // inAppPurchase.on('transactions-updated', (event, transactions) => {

    //   console.log(event, transactions)

    //   if (!Array.isArray(transactions)) {
    //     return
    //   }
    
    //   // Check each transaction.
    //   transactions.forEach(function (transaction) {
    //     var payment = transaction.payment
    
    //     switch (transaction.transactionState) {
    //       case 'purchasing':
    //         console.log(`Purchasing ${payment.productIdentifier}...`)
    //         break
    //       case 'purchased':
    
    //         console.log(`${payment.productIdentifier} purchased.`)
    
    //         // Get the receipt url.
    //         let receiptURL = inAppPurchase.getReceiptURL()
    
    //         console.log(`Receipt URL: ${receiptURL}`)
    
    //         // Submit the receipt file to the server and check if it is valid.
    //         // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
    //         // ...
    //         // If the receipt is valid, the product is purchased
    //         // ...
    
    //         // Finish the transaction.
    //         inAppPurchase.finishTransactionByDate(transaction.transactionDate)
    
    //         break
    //       case 'failed':
    
    //         console.log(`Failed to purchase ${payment.productIdentifier}.`)
    
    //         // Finish the transaction.
    //         inAppPurchase.finishTransactionByDate(transaction.transactionDate)
    
    //         break
    //       case 'restored':
    
    //         console.log(`The purchase of ${payment.productIdentifier} has been restored.`)
    
    //         break
    //       case 'deferred':
    
    //         console.log(`The purchase of ${payment.productIdentifier} has been deferred.`)
    
    //         break
    //       default:
    //         break
    //     }
    //   })
    // })
  }

  handleGoToMain() {
    this.props.updateCurrentScreen('main')
  }

  handleFirstButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 5000}`)
    console.log('dfs')
    // inAppPurchase.purchaseProduct('5000', 1, (isProductValid) => {
    //   console.log(isProductValid)
    //   if (!isProductValid) {
    //     console.log('The product is not valid.')
    //     return
    //   }
  
    //   console.log('The payment has been added to the payment queue.')
    // })
  }

  handleSecondButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 10000}`)
    //inAppPurchase.purchaseProduct('10000')
  }

  handleThirdButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 20000}`)
    //inAppPurchase.purchaseProduct('20000')
  }

  handleFourthButton() {
    const credits = localStorage.getItem('credits')
    localStorage.setItem('credits', `${+credits + 50000}`)
    //inAppPurchase.purchaseProduct('50000')
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