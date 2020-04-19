import React, { Component } from 'react';
import logo from './logo.svg';
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
          <tr key={Timestamp}>
             <td>{Distance}</td>
             <td>{Company}</td>
             <td>{Timestamp}</td>
             <td>{Destination}</td>
             <td>{Source}</td>
             <td>{Price}</td>
             <td>{SurgeMultiplier}</td>
             <td>{CabType}</td>
          </tr>
       )
    })
 }
render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            <strong>Post to Server:</strong>
          </p>
          <p>{this.state.response}</p>
          <form onSubmit={this.handleSubmit}>
          <label>
            Distance:
            <input type="text" name="Distance" 
              onChange={e => this.setDistance(e)}
            />
          </label>
          <br/>
          <label>
            Company:
            <input type="text" name="Company" 
              onChange={e => this.setCompany(e)}
            />
          </label>
          <br/>
          <label>
            Timestamp:
            <input type="text" name="Timestamp" 
              onChange={e => this.setTimestamp(e)}
            />
          </label>      
          <br/>    
          <label>
            Destination:
            <input type="text" name="Destination" 
              onChange={e => this.setDestination(e)}
            />
          </label>
          <br/>
          <label>
            Source:
            <input type="text" name="Source" 
              onChange={e => this.setSource(e)}
            />
          </label>
          <br/>
          <label>
            Price:
            <input type="text" name="Price" 
              onChange={e => this.setPrice(e)}
            />
          </label>
          <br/>
          <label>
            Surge multiplier:
            <input type="text" name="SurgeMultiplier" 
              onChange={e => this.setSurgeMultiplier(e)}
            />
          </label>
          <br/>
          <label>
            Cab type:
            <input type="text" name="CabType" 
              onChange={e => this.setCabType(e)}
            />
          </label>
          <br/>
            <input
              type="text"
              value={this.state.post}
              onChange={e => this.setState({ post: e.target.value })}
            />
            <button type="submit">Submit</button>
          </form>
          
        </header>
        <table id='results'>
               <tbody>
                  {this.renderTableData()}
               </tbody>
          </table>
      </div>
    );
  }
}

export default App;
