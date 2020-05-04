import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Analyze extends Component{
    state = {
      response: '',
      post: '',
      responseToPost: [],
      query: {
        Timestamp: null,
        Stat: null
      },
      startDate: null,
    };
    setAnalyticFeature(e) {
      const val = e.target.value===""?null:e.target.value;
      this.setState(prev => {
        let query = { ...prev.query };  // creating copy of state variable jasper
        query.Stat = val;                     // update the name property, assign a new value
        return { query };
        })
    }

    setTimestamp = date => {
      const val = date==null?null:date.getTime();
      this.setState({startDate: date});
      this.setState(prev => {
        let query = { ...prev.query };  // creating copy of state variable jasper
        query.Timestamp = val;               // update the name property, assign a new value
        return { query };
        })
    }

    componentDidMount() {
      this.callApi()
        .then(res => this.setState({ response: res.express }))
        .catch(err => console.log(err));
    }

    callApi = async () => {
      const response = await fetch('/api/hello');
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);

      return body;
    };

    handleSubmit = async e => {
      e.preventDefault();
      console.log(this.state.post);
      if(this.state.post === 'analyze'){
        var valid = false;
        for(var x in this.state.query)
        {
          if(!(this.state.query[x] == null))  // if all text boxes are empty, you can't search
          {
            valid = true;
          }
        }
        if(valid){  // if there is at least one text box with some values, you can search the DB
          const response = await fetch('/api/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.query),
          });
          const body = await response.text();

          this.setState({ responseToPost: JSON.parse(body) });
        }
      }
    };

    renderTableData() {
      return this.state.responseToPost.map((ride, index) => {
         const { Neighbourhood,
          Count,
          UberCount,
          LyftCount,
          Id } = ride //destructuring
         return (
            <tr key={Id}>
               <td>{Neighbourhood}</td>
               <td>{Count}</td>
               <td>{UberCount}</td>
               <td>{LyftCount}</td>
            </tr>
         )
      })
   }

  render() {
      return (
        <div className="App">
          <header className="App-header">
          <p><strong><a href="../">Uber/Lyft Cab Pickup Helper</a></strong></p>
          </header>
          <header className="Search-header">
          <form onSubmit={this.handleSubmit}>
          <div class="row">
            <div class="column1">
              <div><label>Analytic Feature:</label></div>
              <div><br/></div>
              <div><label>Input Date:</label></div>
            </div>
            <div class="column2">
              <div><select value={this.state.value} onChange={e => this.setAnalyticFeature(e)}>
                <option selected-value=""></option>
                <option value="NeighbourhoodPickup">* What neighborhood has the most pickups on a certain day?</option>
                <option value="NeighbourhoodDropoff">* What neighborhood has the most drop offs on a certain day?</option>
                <option value="NeighbourhoodUber">What neighborhoods have more Uber rides than Lyft rides?</option>
                <option value="NeighbourhoodLyft">What neighborhoods have more Lyft rides than Uber rides?</option>
                <option value="start_point">* What starting point is the most popular at a certain time of day?</option>
                <option value="end_point">* What ending point is the most popular at a certain time of day?</option>
                <option value="most_rides">What specific day has the most rides?</option>
                <option value="top-3">What are the top-3 most popular types of cabs taken?</option>
              </select></div>
              <div class="small-text"><strong><u>(* - Requires Date Input)</u></strong></div>
              <div><DatePicker
                showPopperArrow={false}
                selected={this.state.startDate}
                onChange={this.setTimestamp}
                openToDate={new Date("2018/09/28")}/>
              </div>
            </div>
          </div>
          <button onClick={e => this.setState({ post: e.target.value, responseToPost: [] })} value="analyze" type="submit" class="block-2">Submit</button>
          <a href="http://localhost:3000/"><input type="button" value='Home' class="block-4"/></a>
          </form>
          </header>
          <table id='results'>
            <th>Result</th>
            <th>Number of Rides</th>
            <th>Number of Uber Rides</th>
            <th>Number of Lyft Rides</th>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </table>
        </div>
      );
    }
}

export default Analyze;
