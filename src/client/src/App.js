import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

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
    }
  };
  setDistance(e){
    const val = e.target.value==""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Distance = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setCompany(e){
    const val = e.target.value==""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Company = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setTimestamp(e){
    const val = e.target.value==""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Timestamp = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setDestination(e){
    const val = e.target.value==""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Destination = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setSource(e){
    const val = e.target.value==""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Source = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setPrice(e){
    const val = e.target.value==""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.Price = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setSurgeMultiplier(e){
    const val = e.target.value==""?null:e.target.value;
    this.setState(prev => {
      let query = { ...prev.query };  // creating copy of state variable jasper
      query.SurgeMultiplier = val;                     // update the name property, assign a new value
      return { query };
      })
  }
  setCabType(e){
    const val = e.target.value==""?null:e.target.value;
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

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.query),
    });
    const body = await response.text();

    this.setState({ responseToPost: JSON.parse(body) });
  };
  renderTableData() {
    return this.state.responseToPost.map((student, index) => {
       const { Distance,
        Company,
        Timestamp,
        Destination,
        Source,
        Price,
        SurgeMultiplier,
        CabType } = student //destructuring
       return (
          <tr key={index}>
             <td><button>Edit</button>{Distance} miles</td>
             <td><button>Edit</button>{Company}</td>
             <td><button>Edit</button>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Timestamp)}</td>
             <td><button>Edit</button>{Destination}</td>
             <td><button>Edit</button>{Source}</td>
             <td><button>Edit</button>${Price}</td>
             <td><button>Edit</button>{SurgeMultiplier}</td>
             <td><button>Edit</button>{CabType}</td>
             <td><a>Delete</a></td>
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
          <label>Distance: </label>
          <input type="text" name="Distance" id="Distance"
            onChange={e => this.setDistance(e)}
          />
          <label>Company: </label>
          <input type="text" name="Company" id="Company"
            onChange={e => this.setCompany(e)}
          />
          <label>Timestamp: </label>
          <input type="text" name="Timestamp" id="Timestamp"
            onChange={e => this.setTimestamp(e)}
          />
          <label>Destination: </label>
          <input type="text" name="Destination" id="Destination"
            onChange={e => this.setDestination(e)}
          />
        <br/>
          <label>Source: </label>
          <input type="text" name="Source" id="Source"
            onChange={e => this.setSource(e)}
          />
          <label>Price: </label>
          <input type="text" name="Price" id="Price"
            onChange={e => this.setPrice(e)}
          />
          <label>Surge Multiplier: </label>
          <input type="text" name="SurgeMultiplier" id="SurgeMultiplier"
            onChange={e => this.setSurgeMultiplier(e)}
          />
          <label>Cab Type: </label>
          <input type="text" name="CabType" id="CabType"
            onChange={e => this.setCabType(e)}
          />
        <br/>
        <button onclick={e => this.setState({ post: e.target.value, responseToPost: [] })} type="submit" class="block">Search</button>
        </form>

        </header>
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
