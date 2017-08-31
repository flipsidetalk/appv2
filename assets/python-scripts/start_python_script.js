
var fs = require('fs');

module.exports = function(votes, done) {
  console.log("votes: " + JSON.stringify(votes));
  var spawn = require('child_process').spawn
  var py = spawn('python3', ['public/scripts/Python_Server/ml_script.py'])

  var dataString = '';
  var vis_data

  py.stdout.on('data', function(data){
    dataString += data.toString();
  });

  py.stdout.on('end', function(){
    if (dataString == '') {
      dataString = '{}'
    }
    console.log("dataString: " + dataString);
    var vis_data = '{}';
    try {
       vis_data = JSON.parse(dataString);
    } catch (err) {
      console.log(err);
    }
    saveToFile(JSON.stringify(vis_data), 'public/scripts/Python_Server/data/saved_votes.json');
  });

  //Pipes Python's stderr to Node stdout for debugging
  py.stderr.pipe(process.stdout);

  //Input JSON goes here with following format
  var data = votes;
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
}

function saveToFile(data, filename) {
  fs.writeFile(filename, data, function(err) {
    if (err) throw err;
    }
  );
}