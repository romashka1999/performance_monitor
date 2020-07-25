import React, { Component } from 'react';
import './App.css';
import socket from './utilities/socketConnection';
import Widget from './Widget';

class App extends Component {
  constructor(){
    super();
    this.state = {
      performanceData: {}
    }
  }

  componentDidMount(){
    socket.on('data',(data)=>{

      const currentState = ({...this.state.performanceData});

      currentState[data.macAddress] = data;     
      this.setState({
        performanceData: currentState
      })
    })
  }

  render() {
    console.log(this.state.performanceData);
    let widgets = [];
    const data = this.state.performanceData;
    // grab each machine, by property, from data
    Object.entries(data).forEach(([key,value])=>{
      widgets.push(<Widget key={key} data={value} />)
    })
    return (
      <div className="App">
        {widgets}
      </div>
    );
  }
}

export default App;
