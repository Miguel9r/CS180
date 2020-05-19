const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');

const app = express();
const port = process.env.PORT || 5000;

const dbPath = 'data/db.csv';
const init_time = Date.now();
const readInterface = readline.createInterface({
  input: fs.createReadStream(dbPath),
  output: process.stdout,
  console: false
});

// Index for each column:
// 0 -> Destination
// 1 -> Company
// 2 -> Timestamp
// 3 -> Destination
// 4 -> Source
// 5 -> Price
// 6 -> Surge multiplier
// 7 -> Cab type
// 8 -> ID
var rows = [];
var id = 0;
var last_query;

var neighbourhoods = [];
var dates = [];
var type = [];
/*
* Read the db.csv file
*/
readInterface.on('line', function(line) {
  var row = line.split(',');
  if(row[8] >= id)
  {
    id = row[8]+1;
  }
  rows.push(row);
}).on('close', function(line){
  console.log("File completely read");
  id = rows.length;
  for(i = 1; i<rows.length; i++)
  {
    if(!neighbourhoods.includes(rows[i][3]))
    {
      neighbourhoods.push(rows[i][3]);
    }
    if(!neighbourhoods.includes(rows[i][4]))
    {
      neighbourhoods.push(rows[i][4]);
    }
    if(!dates.includes(Math.floor(rows[i][2]/86400000)))
    {
      dates.push(Math.floor(rows[i][2]/86400000));
    }
    if(!type.includes(rows[i][7]))
    {
      type.push(rows[i][7]);
    }
  }
  prepareStats();
  console.log("Total of rows: " + id);
});
var uberlyftStat = [];
var dateStat = [];
var typesStat = [];
function prepareStats()
{
  var count = [];
  var lyftcount = [];
  for(i = 1; i<rows.length; i++)
  {
    if(rows[i][1] == 'Uber')
    {
      if(count.length <= neighbourhoods.indexOf(rows[i][4]))
      {
        for(t = count.length; t <= neighbourhoods.indexOf(rows[i][4]); t++)
        {
          count.push(0);
        }
      }
      count[neighbourhoods.indexOf(rows[i][4])]+=1;
    }
    if(rows[i][1] == 'Lyft')
    {
      if(lyftcount.length <= neighbourhoods.indexOf(rows[i][4]))
      {
        for(t = lyftcount.length; t <= neighbourhoods.indexOf(rows[i][4]); t++)
        {
          lyftcount.push(0);
        }
      }
      lyftcount[neighbourhoods.indexOf(rows[i][4])]+=1;
    }
  }
  var ret = [];
  for(j = 0;j<neighbourhoods.length;j++)
  {
    ret.push({Neighbourhood: neighbourhoods[j], Count: count[j]+lyftcount[j], UberCount: count[j], LyftCount: lyftcount[j]});
  }
  uberlyftStat = ret;


  var dateCount = [];
  for(j = 1; j<rows.length; j++)
  {
      if(dateCount.length <= dates.indexOf(Math.floor(rows[j][2]/86400000)))
      {
        for(t = dateCount.length; t <= dates.indexOf(Math.floor(rows[j][2]/86400000)); t++)
        {
          dateCount.push(0);
        }
      }
      dateCount[dates.indexOf(Math.floor(rows[j][2]/86400000))]+=1;
    
  }
  var dateret = [];
  for(j = 0;j<dates.length;j++)
  {
    var d = new Date(dates[j]*86400000);
    dateret.push({Neighbourhood: d.toLocaleDateString('en-US'), Count: dateCount[j]});
  }
  dateStat = dateret;
  dateStat = dateStat.sort(compare);

  count = [];
  for(i = 1; i<rows.length; i++)
  {
      if(count.length <= type.indexOf(rows[i][7]))
      {
        for(t = count.length; t <= type.indexOf(rows[i][7]); t++)
        {
          count.push(0);
        }
      }
      count[type.indexOf(rows[i][7])]+=1;
    
  }
  ret = [];
  for(j = 0;j<type.length;j++)
  {
    ret.push({Neighbourhood: type[j], Count: count[j]});
  }
  typesStat = ret.sort(compare);
  
  console.log("Time to initialize the server: "+(Date.now()-init_time)+" milliseconds");
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ server: 'Hello From Server' });
});

app.post('/api/query', (req, res) => {
  console.log(req.body);
  last_query = req.body;
  res.send(
    search(req.body),
  );
  
});

app.post('/api/delete', (req, res) => {
  console.log(req.body);
  deleteRow(req.body)
  res.send(
    search(last_query),
  );
});
app.post('/api/update', (req, res) => {
  console.log(req.body);
  updateRow(req.body)
  res.send(
    search(last_query),
  );
});
app.post('/api/stats', (req, res) => {
  console.log(req.body);
  const stat_time = Date.now();
  res.send(
    stats(req.body),
  );
  console.log("Time to get stat reply: "+(Date.now()-stat_time)+" milliseconds");
});

app.post('/api/insert', (req, res) => { // used for calling the addRow function
  console.log(req.body);
  addRow(req.body)
  res.send(
    search(last_query),
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));


/*
* Analytics function
* Return an array of those rows as objects
*/
function stats(criteria) {
  switch(criteria.Stat)
  {
    case 'NeighbourhoodPickup':
      var count = [];
      for(i = 1; i<rows.length; i++)
      {
        if(rows[i][2] >= criteria.Option && rows[i][2] < (criteria.Option+86400000))
        {
          if(count.length <= neighbourhoods.indexOf(rows[i][4]))
          {
            for(t = count.length; t <= neighbourhoods.indexOf(rows[i][4]); t++)
            {
              count.push(0);
            }
          }
          count[neighbourhoods.indexOf(rows[i][4])]+=1;
        }
      }
      var ret = [];
      for(j = 0;j<neighbourhoods.length;j++)
      {
        ret.push({Neighbourhood: neighbourhoods[j], Count: count[j]});
      }
      return JSON.stringify(ret);
    case 'NeighbourhoodDropoff':
      var count = [];
      for(i = 1; i<rows.length; i++)
      {
        if(rows[i][2] >= criteria.Option && rows[i][2] < (criteria.Option+86400000))
        {
          if(count.length <= neighbourhoods.indexOf(rows[i][3]))
          {
            for(t = count.length; t <= neighbourhoods.indexOf(rows[i][3]); t++)
            {
              count.push(0);
            }
          }
          count[neighbourhoods.indexOf(rows[i][3])]+=1;
        }
      }
      var ret = [];
      for(j = 0;j<neighbourhoods.length;j++)
      {
        ret.push({Neighbourhood: neighbourhoods[j], Count: count[j]});
      }
      return JSON.stringify(ret);
    case 'NeighbourhoodUber':
      ret = []
      for(j = 0;j<uberlyftStat.length;j++)
      {
        if(uberlyftStat[j].UberCount>uberlyftStat[j].LyftCount)
        {ret.push(uberlyftStat[j]);}
      }
      console.log("Number of results: " + ret.length);
      if (ret.length == 0) {
        ret.push({Neighbourhood: "NONE", UberCount: "", LyftCount: ""});
        console.log("Number of results: " + ret.length);
      }
      return JSON.stringify(ret);
    case 'NeighbourhoodLyft':
      ret = []
      for(j = 0;j<uberlyftStat.length;j++)
      {
        if(uberlyftStat[j].LyftCount>uberlyftStat[j].UberCount)
        {ret.push(uberlyftStat[j]);}
      }
      console.log("Number of results: " + ret.length);
      if (ret.length == 0) {
        ret.push({Neighbourhood: "NONE", UberCount: "", LyftCount: ""});
        console.log("Number of results: " + ret.length);
      }
      return JSON.stringify(ret);
    case 'start_point':
      var count = [];
      for(i = 1; i<rows.length; i++)
      {
        if(rows[i][2]%86400000 >= criteria.Option && rows[i][2]%86400000 < (criteria.Option+3600000))
        {
          if(count.length <= neighbourhoods.indexOf(rows[i][3]))
          {
            for(t = count.length; t <= neighbourhoods.indexOf(rows[i][3]); t++)
            {
              count.push(0);
            }
          }
          count[neighbourhoods.indexOf(rows[i][3])]+=1;
        }
      }
      var ret = [];
      for(j = 0;j<neighbourhoods.length;j++)
      {
        ret.push({Neighbourhood: neighbourhoods[j], Count: count[j]});
      }
      return JSON.stringify(ret);
    case 'end_point':
      var count = [];
      for(i = 1; i<rows.length; i++)
      {
        if(rows[i][2]%86400000 >= criteria.Option && rows[i][2]%86400000 < (criteria.Option+3600000))
        {
          if(count.length <= neighbourhoods.indexOf(rows[i][4]))
          {
            for(t = count.length; t <= neighbourhoods.indexOf(rows[i][4]); t++)
            {
              count.push(0);
            }
          }
          count[neighbourhoods.indexOf(rows[i][4])]+=1;
        }
      }
      var ret = [];
      for(j = 0;j<neighbourhoods.length;j++)
      {
        ret.push({Neighbourhood: neighbourhoods[j], Count: count[j]});
      }
      return JSON.stringify(ret);
    case 'most_rides':
      return JSON.stringify(dateStat.sort(compare).slice(0, 10));
    case 'top-3':
      
      return JSON.stringify(typesStat.sort(compare).slice(0, 3));
    default:
      return '';
    // code block
  }
}

function compare(a, b) {
  if (a.Count > b.Count) return -1;
  if (b.Count > a.Count) return 1;

  return 0;
}

/*
* Delete the row selected from the local database (local array of rows)
* Then overwrite the db.csv file with the new local database
*/
function deleteRow(row) {
  var i;
  for(i = 0; i<rows.length; i++)
  {
    if(rows[i][8] === row.delete)
    {
      dateStat[dates.indexOf(Math.floor(rows[i][2]/86400000))].Count--;
      typesStat[type.indexOf(rows[i][7])].Count--;
      if(rows[i][1] === 'Uber')
      {
        uberlyftStat[neighbourhoods.indexOf(rows[i][4])].UberCount--;
      }else if(rows[i][1] === 'Lyft')
      {
        uberlyftStat[neighbourhoods.indexOf(rows[i][4])].LyftCount--;
      }
      rows.splice(i, 1);
      break;
    }
  }
  writeBlank();
}

/*
* Update the row selected from the local database (local array of rows)
* Then overwrite the db.csv file with the new local database
*/
function updateRow(row) {
  var i;
  for(i = 0; i<rows.length; i++)
  {
    var object = {
      "Distance": 0,
      "Company": 1,
      "Timestamp": 2,
      "Destination": 3,
      "Source": 4,
      "Price": 5,
      "SurgeMultiplier": 6,
      "CabType": 7,
      "Id": 8
    };
    if(rows[i][8] === row.update.Id)
    {
      if(object[row.field]==1)
      {
        
        if(rows[i][object[row.field]] === 'Uber')
        {
          uberlyftStat[neighbourhoods.indexOf(rows[i][4])].UberCount--;
        }else if(rows[i][object[row.field]] === 'Lyft')
        {
          uberlyftStat[neighbourhoods.indexOf(rows[i][4])].LyftCount--;
        }
      
        if(row.value === 'Uber')
        {
          uberlyftStat[neighbourhoods.indexOf(rows[i][4])].UberCount++;
        }else if(row.value === 'Lyft')
        {
          uberlyftStat[neighbourhoods.indexOf(rows[i][4])].LyftCount++;
        }
      }else if(object[row.field] == 2)
      {
        dateStat[dates.indexOf(Math.floor(rows[i][object[row.field]]/86400000))].Count--;
        if(dates.includes(Math.floor(row.value/86400000)))
        {
          dateStat[dates.indexOf(Math.floor(row.value/86400000))].Count++;
        }else{
          dates.push(Math.floor(row.value/86400000));
          var d = new Date(Math.floor(row.value/86400000)*86400000);
          dateStat.push({Neighbourhood: d.toLocaleDateString('en-Us'), Count: 1});
        }
      }else if(object[row.field] == 7)
      {
        typesStat[type.indexOf(row.value)].Count++;
        typesStat[type.indexOf(rows[i][7])].Count--;
      }
      rows[i][object[row.field]] = row.value;
      
      break;
    }
  }
  writeBlank();
}

/*
* Insert the info that was added into the fields to the database
*
*/

function addRow(info) {
  newRow = [];
  for(x in info)
  {
    newRow.push(info[x]);
  }
  newRow.push(id);
  id++;
  rows.push(newRow);
  if(newRow[1] === 'Uber')
  {
    uberlyftStat[neighbourhoods.indexOf(newRow[4])].UberCount++;
    uberlyftStat[neighbourhoods.indexOf(newRow[4])].Count++;
  }else if(newRow[1] === 'Lyft')
  {
    uberlyftStat[neighbourhoods.indexOf(newRow[4])].LyftCount++;
    uberlyftStat[neighbourhoods.indexOf(newRow[4])].Count++;
  }
  if(dates.includes(Math.floor(newRow[2]/86400000)))
  {
    dateStat[dates.indexOf(Math.floor(newRow[2]/86400000))].Count++;
  }else{
    dates.push(Math.floor(newRow[2]/86400000));
    var d = new Date(Math.floor(newRow[2]/86400000)*86400000);
    dateStat.push({Neighbourhood: d.toLocaleDateString('en-Us'), Count: 1});
  }
  typesStat[type.indexOf(newRow[7])].Count++;

  console.log("Inserted the following information: " + newRow);
  writeBlank();
}

/*
* Search for the rows that match the criteria from the local database (local array of rows)
* Return an array of those rows as objects
*/
function search(criteria) {
  var query = criteria;
  for (y in query) {
    if(y == 'Distance' && isNaN(query[y]))  // Validation checks
    {
      console.log("Error: The Distance has to be an integer.  Setting it to null as Default.");
    }
    else if(y == 'Price' && isNaN(query[y]))
    {
      console.log("Error: The Price has to be an integer.  Setting it to null as Default.");
    }
    else if(y == 'SurgeMultiplier' && isNaN(query[y]))
    {
      console.log("Error: The Surge Multiplier has to be an integer.  Setting it to null as Default.");
    }
  }
  var valid = false;
  results = [];
  var show = true;
  for(x in query)
  {
    if(query[x] != null)
    {
      valid = true;
    }
  }
  if(!valid)
  {
    return [];
  }
  for(var i = 1; i < rows.length; i++)
  {
    var add = true;
    var j = 0;
    for(x in query)
    {
      if(x == 'Timestamp')
      {
        if(query[x] != null && !(rows[i][j] >= query[x] && rows[i][j] < (query[x]+86400000)))
        {
          add = false;
        }
      }
      else{
        if(query[x] != null && !(rows[i][j] === query[x]))
        {
          add = false;
        }
      }
      j++;
    }
    if(add == true)
    {
      var object = {  // needed to create for use of ID in object
        "Distance": "0.44",
        "Company": "Lyft",
        "Timestamp": 1544952607890,
        "Destination": "North Station",
        "Source": "Haymarket Square",
        "Price": 5,
        "SurgeMultiplier": 1,
        "CabType": "Shared",
        "Id": "3"
      };
      j= 0;
      for(x in object)
      {
          object[x] = rows[i][j];
          j++;
      }
      results.push(object);
    }
  }
  if (results.length > 1000) { // limiting the results printed to 20,000
    console.log("The amount of results are too high: " + results.length + " results");
    results.length = 1000;
    console.log("Resizing the printed results to avoid a wait time.  New size:")
  }
  console.log(results.length + " results");
  var returnArr = JSON.stringify(results);
  return returnArr;
}
/*
* Convert db.csv into a blank file then write the new info to the file
*/
function writeBlank(){
  fs.open(dbPath, 'w', function (err, file) {
  if (err) throw err;
  console.log('File is opened in write mode.');
});
  fs.writeFile(dbPath, '', function(){console.log('done');writeBack();})
}
/*
* Save the local database to the db.csv file
*/
function writeBack(){
  var stream = fs.createWriteStream(dbPath, {flags:'a'});
  for(row in rows)
  {
    var string = '';
    for(element in rows[row])
    {
      string += rows[row][element] + ',';
    }
    string = string.substring(0, string.length - 1);
    string += '\n';
    stream.write(string);
  }
  neighbourhoods = []
  for(i = 1; i<rows.length; i++)
  {
    if(!neighbourhoods.includes(rows[i][3]))
    {
      neighbourhoods.push(rows[i][3]);
    }
    if(!neighbourhoods.includes(rows[i][4]))
    {
      neighbourhoods.push(rows[i][4]);
    }
  }
}
