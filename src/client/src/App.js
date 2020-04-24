import React, { Component } from 'react';
import Popup from "reactjs-popup";
//import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: [],
    query: {
      Distance: null,
      Company: null,
      Timestamp: null,
      Destination: null,
      Source: null,
      Price: null,
      SurgeMultiplier: null,
      CabType: null
    },
    open: false,
    startDate: null
  };
  setDistance(e){
    const val = e.target.value===""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Distance = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setCompany(e){
    const val = e.target.value===""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Company = val;                     // update the name property, assign a new value
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
  setDestination(e){
    const val = e.target.value===""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Destination = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setSource(e){
    const val = e.target.value===""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Source = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setPrice(e){
    const val = e.target.value===""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Price = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setSurgeMultiplier(e){
    const val = e.target.value===""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.SurgeMultiplier = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setCabType(e){
    const val = e.target.value===""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.CabType = val;                     // update the name property, assign a new value
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
  closeModal = async e => {
    this.setState({ open: false });
  }

  handleSubmit = async e => {
    e.preventDefault();
    console.log(this.state.post);
    if(this.state.post == 'search'){
      var valid = false;
      for(var x in this.state.query)
      {
        if(!(this.state.query[x] == null))
        {
          valid = true;
        }
      }
      if(valid){
        const response = await fetch('/api/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.state.query),
        });
        const body = await response.text();

        this.setState({ responseToPost: JSON.parse(body) });
      }
    }else{
      var valid = true;
      for(var x in this.state.query)
      {
        if(this.state.query[x] == null)
        {
          valid = false;
        }
      }
      if(!valid){
        this.setState({ open: true });
      }else{
        const response = await fetch('/api/insert', {
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

  deleteRow = async row => {
    console.log("Heyy");
    const response = await fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({delete: row.Id}),
    });
    const body = await response.text();

    this.setState({ responseToPost: JSON.parse(body) });
  };
  renderTableData() {
    return this.state.responseToPost.map((ride, index) => {
       const { Distance,
        Company,
        Timestamp,
        Destination,
        Source,
        Price,
        SurgeMultiplier,
        CabType,
        Id } = ride //destructuring
        //const i = ride.Id; not needed, commented out
        const date = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Timestamp);
       return (
          <tr key={Id}>
             <td>{Distance}</td>
             <td>{Company}</td>
             <td>{date}</td>
             <td>{Destination}</td>
             <td>{Source}</td>
             <td>{Price}</td>
             <td>{SurgeMultiplier}</td>
             <td>{CabType}</td>
             <td id="delete"><button onClick={() => this.deleteRow({Id})}>Delete</button></td>
          </tr>
       )
    })
 }

render() {
    return (
      <div className="App">
        <header className="App-header">
        <p>
          <strong>Uber/Lyft Cab Pickup Helper</strong>
        </p>
        </header>
        <header className="Search-header">
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <div>
          <label>Distance: </label>
          <input type="text" name="Distance" id="Distance"
            onChange={e => this.setDistance(e)}
          /></div>
          <div>
          <label>Company: </label>
          <input type="text" name="Company" id="Company"
            onChange={e => this.setCompany(e)}
          /></div>
          <div>
          <label>Date: </label>
          <DatePicker
            showPopperArrow={false}
            selected={this.state.startDate}
            onChange={this.setTimestamp}
          />
          </div>
          <div>
          <label>Destination: </label>
          <input type="text" name="Destination" id="Destination"
            onChange={e => this.setDestination(e)}
          /></div>
          <div>
          <label>Source: </label>
          <input type="text" name="Source" id="Source"
            onChange={e => this.setSource(e)}
          /></div>
          <div>
          <label>Price: </label>
          <input type="text" name="Price" id="Price"
            onChange={e => this.setPrice(e)}
          /></div>
          <div>
          <label>Surge Multiplier: </label>
          <input type="text" name="SurgeMultiplier" id="SurgeMultiplier"
            onChange={e => this.setSurgeMultiplier(e)}
          /></div>
          <div>
          <label>Cab Type: </label>
          <input type="text" name="CabType" id="CabType"
            onChange={e => this.setCabType(e)}
          /></div>
        <br/>
        <button onClick={e => this.setState({ post: e.target.value, responseToPost: [] })} value="search" type="submit" class="block-1">Search</button>
        <button onClick={e => this.setState({ post: e.target.value })} type="submit" value="add" class="block-2">Insert</button>
        </form>

        </header>
        <Popup
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
          <div className="modal">
            <b id="errorMsg">Error: You need to complete all fields to insert a new row.</b>
            <br/>
            <br/>
            <Button variant="contained" id="closeButton" onClick={this.closeModal}>
            Close
            </Button>
          </div>
        </Popup>
        <table id='results'>
        <th>Distance</th>
        <th>Company</th>
        <th>Date</th>
        <th>Destination</th>
        <th>Source</th>
        <th>Price</th>
        <th>Surge Multiplier</th>
        <th>Cab Type</th>
        <th></th>
               <tbody>
                  {this.renderTableData()}
               </tbody>
          </table>
      </div>
    );
  }
}

export default App;
