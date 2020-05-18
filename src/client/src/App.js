import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Analyze from './Analyze';
import Search from './Search';
import Insert from './Insert';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/analyze" component={Analyze}/>
            <Route exact path="/search" component={Search}/>
            <Route exact path="/insert" component={Insert}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
