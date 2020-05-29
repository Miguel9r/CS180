import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";

class Home extends Component{
  render() {
      return (
        <div className="App">
          <header className="home-header">
            <p><strong><a href="../">Uber/Lyft Assistant</a></strong></p>
          </header>
          <header className="home-header2">
            <p>Please choose one of our current database functions.</p>
            <a href="http://localhost:3000/search"><input type="button" value='Search' class="block-1"/></a>
            <a href="http://localhost:3000/insert"><input type="button" value='Insert' class="block-2"/></a>
            <a href="http://localhost:3000/analyze"><input type="button" value='Analyze' class="block-4"/></a>
          </header>
        </div>
      );
    }
}

export default Home;
