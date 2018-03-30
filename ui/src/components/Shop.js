import React, { Component } from 'react';
import { Button } from 'antd'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Shop extends Component {

  constructor(props) {
    super(props)

    this.handleGoToMain = this.handleGoToMain.bind(this)
  }

  handleGoToMain() {
    this.props.updateCurrentScreen('main')
  }

  render() {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Button shape="circle" icon="arrow-left" onClick={this.handleGoToMain} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', width: '100%', alignItems: 'center' }}>
          


        <Button style={formItemStyle} type="primary">Buy 100 credits</Button>
        <Button style={formItemStyle} type="primary">Buy 500 credits</Button>
        <Button style={formItemStyle} type="primary">Buy 1000 credits</Button>
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