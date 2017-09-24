import React, { Component } from 'react';
import 'typeface-roboto'
import Scale from './Scale'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <Scale/>
      </div>
    );
  }
}

export default App;
