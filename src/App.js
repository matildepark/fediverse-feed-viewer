import React, { Component } from 'react';
import Feed from './feed.js';
import './App.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Home from './home.js';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/:handle" component={Feed} />
      </div>
      </Router>
    );
  }
}

export default App;
