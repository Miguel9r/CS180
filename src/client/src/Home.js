import React, { Component } from 'react';
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
