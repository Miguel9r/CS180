import React, { Component } from 'react';
import Popup from "reactjs-popup";
import Button from '@material-ui/core/Button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Home extends Component{
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
      openEdit: false,
      editField: null,
      editRow: null,
      editValue: null,
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
    closeEditModal = async e => {
      this.setState({ openEdit: false });
    }

    handleSubmit = async e => {
      e.preventDefault();
      console.log(this.state.post);
      console.log(this.state.query);
      for(var k in this.state.query)  // used for validation checking
      {
        if(k === 'Distance' && isNaN(this.state.query[k]))
        {
          alert("Distance must be an integer/decimal. Searching with a null value for Distance...");
        }
        else if(k === 'Price' && isNaN(this.state.query[k]))
        {
          alert("Price must be an integer/decimal. Searching with a null value for Price...");
        }
        else if(k === 'SurgeMultiplier' && isNaN(this.state.query[k]))
        {
          alert("Surge Multiplier must be an integer/decimal. Searching with a null value for Surge Multiplier...");
        }
        else if(k === 'Company' && this.state.query[k] !== null)
        {
          if (this.state.query[k] === 'Uber' || this.state.query[k] === 'Lyft') {
            // do nothing
          }else {
            alert("Company must be either Uber/Lyft. Searching with a null value for Company...");
            this.state.query[k] = null;
          }
        }
      }
      if(this.state.post === 'search'){
        var valid = false;
        for(var x in this.state.query)
        {
          if(!(this.state.query[x] == null))  // if all text boxes are empty, you can't search
          {
            valid = true;
          }
        }
        if(valid){  // if there is at least one text box with some values, you can search the DB
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
      }else{ // if the insert button is pressed
        valid = true;
        for(var y in this.state.query)
        {
          if(this.state.query[y] == null)   // if not all the text boxes are filled, then you can't insert a new item into DB
          {
            valid = false;
          }
        }
        if(!valid){
          this.setState({ open: true });
        }else{  // if all the text boxes are filled, insert into DB.
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
    setTheState = async (row, fieldVal) => {
      this.setState({editField: fieldVal, editRow: row, openEdit: true});
    }

    updateRow = async e => {
      e.preventDefault();
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({update: this.state.editRow, field: this.state.editField, value: this.state.editValue}),
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
               <td><button onClick={() => this.setTheState({Id}, "Distance")}>Edit</button>{Distance}</td>
               <td><button onClick={() => this.setTheState({Id}, "Company")}>Edit</button>{Company}</td>
               <td><button onClick={() => this.setTheState({Id}, "Timestamp")}>Edit</button>{date}</td>
               <td><button onClick={() => this.setTheState({Id}, "Destination")}>Edit</button>{Destination}</td>
               <td><button onClick={() => this.setTheState({Id}, "Source")}>Edit</button>{Source}</td>
               <td><button onClick={() => this.setTheState({Id}, "Price")}>Edit</button>{Price}</td>
               <td><button onClick={() => this.setTheState({Id}, "SurgeMultiplier")}>Edit</button>{SurgeMultiplier}</td>
               <td><button onClick={() => this.setTheState({Id}, "CabType")}>Edit</button>{CabType}</td>
               <td id="delete"><button onClick={() => this.deleteRow({Id})}>Delete</button></td>
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
              <div><label>Distance:</label></div>
              <div><label>Company:</label></div>
              <div><label>Date:</label></div>
              <div><label>Destination:</label></div>
              <div><label>Source:</label></div>
              <div><label>Price:</label></div>
              <div><label>Surge Multiplier:</label></div>
              <div><label>Cab Type:</label></div>
            </div>
            <div class="column2">
              <div><input type="text" name="Distance" id="Distance" size="20"
                onChange={e => this.setDistance(e)}/></div>
              <div><select value={this.state.value} onChange={e => this.setCompany(e)} id="select">
                <option selected-value=""></option>
                <option value="Uber">Uber</option>
                <option value="Lyft">Lyft</option>
              </select></div>
              <div><DatePicker
                showPopperArrow={false}
                selected={this.state.startDate}
                onChange={this.setTimestamp}
                openToDate={new Date("2018/09/28")}/></div>
              <div><select value={this.state.value} onChange={e => this.setDestination(e)} id="select">
                <option selected-value=""></option>
                <option value="North Station">North Station</option>
                <option value="Haymarket Square">Haymarket Square</option>
                <option value="Northeastern University">Northeastern University</option>
                <option value="Back Bay">Back Bay</option>
                <option value="West End">West End</option>
                <option value="North End">North End</option>
                <option value="South Station">South Station</option>
                <option value="Beacon Hill">Beacon Hill</option>
                <option value="Fenway">Fenway</option>
                <option value="Theatre District">Theatre District</option>
                <option value="Boston University">Boston University</option>
                <option value="Financial District">Financial District</option>
              </select></div>
              <div><select value={this.state.value} onChange={e => this.setSource(e)} id="select">
                <option selected-value=""></option>
                <option value="North Station">North Station</option>
                <option value="Haymarket Square">Haymarket Square</option>
                <option value="Northeastern University">Northeastern University</option>
                <option value="Back Bay">Back Bay</option>
                <option value="West End">West End</option>
                <option value="North End">North End</option>
                <option value="South Station">South Station</option>
                <option value="Beacon Hill">Beacon Hill</option>
                <option value="Fenway">Fenway</option>
                <option value="Theatre District">Theatre District</option>
                <option value="Boston University">Boston University</option>
                <option value="Financial District">Financial District</option>
              </select></div>
              <div><input type="text" name="Price" id="Price"
                onChange={e => this.setPrice(e)}/></div>
              <div><select value={this.state.value} onChange={e => this.setSurgeMultiplier(e)} id="select">
                <option selected-value=""></option>
                <option value="1">1</option>
                <option value="1.25">1.25</option>
                <option value="1.5">1.5</option>
                <option value="1.75">1.75</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
                <option value="3">3</option>
              </select></div>
              <div><select value={this.state.value} onChange={e => this.setCabType(e)} id="select">
                <option selected-value=""></option>
                <option value="Black">Black</option>
                <option value="Black SUV">Black SUV</option>
                <option value="Lux">Lux</option>
                <option value="Lux Black">Lux Black</option>
                <option value="Lux Black XL">Lux Black XL</option>
                <option value="Lyft">Lyft</option>
                <option value="Lyft XL">Lyft XL</option>
                <option value="Shared">Shared</option>
                <option value="Taxi">Taxi</option>
                <option value="UberPool">UberPOOL</option>
                <option value="UberX">UberX</option>
                <option value="UberXL">UberXL</option>
                <option value="WAV">WAV</option>
              </select></div>
            </div>
          </div>
          <button onClick={e => this.setState({ post: e.target.value, responseToPost: [] })} value="search" type="submit" class="block-1">Search</button>
          <button onClick={e => this.setState({ post: e.target.value })} type="submit" value="add" class="block-2" data-testid='buttoninsert' itemID="insert">Insert</button>
          <input class="block-3" type="reset" value="Reset"/>
          <a href="http://localhost:3000/analyze"><input type="button" value='Analyze' class="block-4"/></a>
          </form>
          </header>
          <Popup
            open={this.state.openEdit}
            closeOnDocumentClick
            onClose={this.closeModal}
          >
            <div className="modal">
              <form onSubmit={this.updateRow}>
              <div>
              <label>{this.state.editField}: </label>
              <br/>
              <input type="text" name="EditValue" id="EditValue"
                onChange={e => this.setState({editValue: e.target.value})}
              /></div>
              <br/>
              <Button variant="contained" id="closeButton" type="submit">
              Edit
              </Button>
              </form>
              <br/>
              <Button variant="contained" id="closeButton" onClick={this.closeEditModal}>
              Close
              </Button>
            </div>
          </Popup>
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

export default Home;
