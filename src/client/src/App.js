import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import Home from './Home';
import Analyze from './Analyze';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/analyze" component={Analyze}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
