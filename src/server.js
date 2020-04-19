const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');

const app = express();
const port = process.env.PORT || 5000;

const readInterface = readline.createInterface({
  input: fs.createReadStream('data/cab_rides.csv'),
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
var rows = [];

readInterface.on('line', function(line) {
  rows.push(line.split(','));
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  // strDelimiter = ",";

  // // Create a regular expression to parse the CSV values.
  // var objPattern = new RegExp(
  //     (
  //         // Delimiters.
  //         "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

  //         // Quoted fields.
  //         "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

  //         // Standard fields.
  //         "([^\"\\" + strDelimiter + "\\r\\n]*))"
  //     ),
  //     "gi"
  //     );


  // // Create an array to hold our individual pattern
  // // matching groups.
  // var arrMatches = null;

  // // Keep looping over the regular expression matches
  // // until we can no longer find a match.
  // var i = 0;
  // while (arrMatches = objPattern.exec( line )){

  //     // Get the delimiter that was found.
  //     var strMatchedDelimiter = arrMatches[ 1 ];

  //     // Check to see if the given delimiter has a length
  //     // (is not the start of string) and if it matches
  //     // field delimiter. If id does not, then we know
  //     // that this delimiter is a row delimiter.
  //     if (
  //         strMatchedDelimiter.length &&
  //         strMatchedDelimiter !== strDelimiter
  //         ){

  //         // Since we have reached a new row of data,
  //         // add an empty row to our data array.
  //         rows.push( [] );

  //     }

  //     var strMatchedValue;

  //     // Now that we have our delimiter out of the way,
  //     // let's check to see which kind of value we
  //     // captured (quoted or unquoted).
  //     if (arrMatches[ 2 ]){

  //         // We found a quoted value. When we capture
  //         // this value, unescape any double quotes.
  //         strMatchedValue = arrMatches[ 2 ].replace(
  //             new RegExp( "\"\"", "g" ),
  //             "\""
  //             );

  //     } else {

  //         // We found a non-quoted value.
  //         strMatchedValue = arrMatches[ 3 ];

  //     }
  //     // Now that we have our value string, let's add
  //     // it to the data array.
  //     if(i != 7 && i != 8){
  //       rows[ rows.length - 1 ].push( strMatchedValue );
  //     }
  //     i=i+1;
  //   }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ server: 'Hello From Server' });
});

app.post('/api/query', (req, res) => {
  console.log(req.body);
  res.send(
    search(req.body),
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

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
      if(show)
      {
        show = false;
      }
      if(j==7)
      {
        j = 9;
      }
      console
      if(query[x] != null && !(rows[i][j] === query[x]))
      {
        add = false;
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
        "CabType": "Shared"
      };
      var fields = new Array(
        "Distance",
        "Company",
        "Timestamp",
        "Destination",
        "Source",
        "Price",
        "SurgeMultiplier",
        "CabType"
      );
      j=0;
      for(x in query)
      {
        if(j==7)
        {
          j = 9;
        }
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


