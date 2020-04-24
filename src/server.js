const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');

const app = express();
const port = process.env.PORT || 5000;

const dbPath = 'data/db.csv';

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
  console.log("Total of rows: " + id);
});


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

app.post('/api/insert', (req, res) => { // used for calling the addRow function
  console.log(req.body);
  addRow(req.body)
  res.send(
    search(last_query),
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

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
      rows.splice(i, 1);
      break;
    }
  }
  writeBlank();
}

/*
* Insert the info that was added into the fields to the database
* STILL NEEDS A LOT OF WORK DONE
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

  console.log("Inserted the following information: " + newRow);
  writeBlank();
  //var returnArr = JSON.stringify(rows);
  //return returnArr;
}

/*
* Search for the rows that match the criteria from the local database (local array of rows)
* Return an array of those rows as objects
*/
function search(criteria) {
  var query = criteria;
  results = [];
  var show = true;
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
      var object = {
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
  console.log(results.length + " results");
  var returnArr = JSON.stringify(results);
  //console.log(returnArr);
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
}
