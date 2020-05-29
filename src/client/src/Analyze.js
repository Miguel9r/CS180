import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Analyze extends Component{
    state = {
      response: '',
      post: '',
      responseToPost: [],
      query: {
        Option: null,
        Stat: null
      },
      startDate: null,
      lastStat: null,
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
        query.Option = val;               // update the name property, assign a new value
        return { query };
        })
    }

    setTime(e) {
      const val = e.target.value===""?null:e.target.value;
      this.setState(prev => {
        let query = { ...prev.query };  // creating copy of state variable jasper
        query.Option = val*3600000;                     // update the name property, assign a new value
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
          this.setState({ lastStat: this.state.query.Stat });
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
    compare(a, b) {
      if (a.Count > b.Count) return -1;
      if (b.Count > a.Count) return 1;
    
      return 0;
    }
    renderTableData() {
      if(this.state.lastStat === "top-3"||this.state.lastStat === "most_rides"||this.state.lastStat === "NeighbourhoodPickup"||this.state.lastStat === "NeighbourhoodDropoff"||this.state.lastStat === "start_point"||this.state.lastStat === "end_point")
     {
      return this.state.responseToPost.sort(this.compare).map((ride, index) => {
         const { Neighbourhood,
          Count,
          Id } = ride //destructuring
         return (
            <tr key={Id}>
               <td>{Neighbourhood}</td>
               <td>{Count}</td>
            </tr>
         )
      })
    }else if(this.state.lastStat === "NeighbourhoodUber"||this.state.lastStat === "NeighbourhoodLyft")
    {
     return this.state.responseToPost.sort(this.compare).map((ride, index) => {
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
   }
   renderOption() {
     if(this.state.query.Stat === "NeighbourhoodPickup"||this.state.query.Stat === "NeighbourhoodDropoff")
     {
      return (
        <div><DatePicker
                showPopperArrow={false}
                selected={this.state.startDate}
                onChange={this.setTimestamp}
                openToDate={new Date("2018/09/28")}/>
        </div>
      )
     }
     if(this.state.query.Stat === "start_point"||this.state.query.Stat === "end_point")
     {
      return (
        <div><select value={this.state.value} onChange={e => this.setTime(e)}>
                <option selected-value=""></option>
                <option value="0">0:00</option>
                <option value="1">1:00</option>
                <option value="2">2:00</option>
                <option value="3">3:00</option>
                <option value="4">4:00</option>
                <option value="5">5:00</option>
                <option value="6">6:00</option>
                <option value="7">7:00</option>
                <option value="8">8:00</option>
                <option value="9">9:00</option>
                <option value="10">10:00</option>
                <option value="11">11:00</option>
                <option value="12">12:00</option>
                <option value="13">13:00</option>
                <option value="14">14:00</option>
                <option value="15">15:00</option>
                <option value="16">16:00</option>
                <option value="17">17:00</option>
                <option value="18">18:00</option>
                <option value="19">19:00</option>
                <option value="20">20:00</option>
                <option value="21">21:00</option>
                <option value="22">22:00</option>
                <option value="23">23:00</option>
              </select></div>
      )
     }
 }
 renderLabel() {
  if(this.state.query.Stat === "NeighbourhoodPickup"||this.state.query.Stat === "NeighbourhoodDropoff")
  {
   return (
    <div><label>Input Date:</label></div>
   )
  }
  if(this.state.query.Stat === "start_point"||this.state.query.Stat === "end_point")
  {
   return (
    <div><label>Input Hour:</label></div>
   )
  }
}
renderTable() {
  if(this.state.lastStat === "NeighbourhoodPickup"||this.state.lastStat === "NeighbourhoodDropoff")
  {
   return (
    <table id='results'>
    <th>Neighbourhood</th>
    <th>Number of Rides</th>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </table>
   )
  }else if(this.state.lastStat === "NeighbourhoodUber"||this.state.lastStat === "NeighbourhoodLyft")
  {
   return (
    <table id='results'>
    <th>Neighbourhood</th>
    <th>Number of Rides</th>
    <th>Number of Uber Rides</th>
    <th>Number of Lyft Rides</th>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </table>
   )
  }
  else if(this.state.lastStat === "start_point"||this.state.lastStat === "end_point")
  {
   return (
    <table id='results'>
    <th>Neighbourhood</th>
    <th>Number of Rides</th>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </table>
   )
  }else if(this.state.lastStat === "most_rides")
  {
    return (
      <table id='results'>
      <th>Date</th>
      <th>Number of Rides</th>
              <tbody>
                {this.renderTableData()}
              </tbody>
            </table>
     )
  }else if(this.state.lastStat === "top-3")
  {
    return (
      <table id='results'>
      <th>Type</th>
      <th>Number of Rides</th>
              <tbody>
                {this.renderTableData()}
              </tbody>
            </table>
     )
  }
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
              {this.renderLabel()}
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
              {this.renderOption()}
            </div>
          </div>
          <button onClick={e => this.setState({ post: e.target.value, responseToPost: [] })} value="analyze" type="submit" class="block-2">Submit</button>
          <a href="http://localhost:3000/"><input type="button" value='Home' class="block-4"/></a>
          </form>
          </header>
            {this.renderTable()}
            
        </div>
      );
    }
}

export default Analyze;
