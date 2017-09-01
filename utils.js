module.exports.upsert = function(table, values, condition) {
  return table.findOne({
      where: condition
    })
    .then(function(obj) {
      if (obj) {
        return obj.update(values);
      } else {
        return table.create(values);
      }
    });
}

module.exports.makeExternalRequest = function(request, url, data, success) {
  request({
      url: url,
      method: 'POST',
      json: true,
      body: data
  }, function (error, response, body) {
    console.log('Response: ' + response);
    if (!error) {
      success(body);
    }
  });
}

module.exports.updateVizState = function(db, res, currentVotes) {
  var pythonVis = require('./assets/python-scripts/start_python_script.js');
  var out;
  db.vote.findAll().then(inputData => {
    try {
      var votes = JSON.parse(inputData);
      if (votes.length > currentVotesLength) {
        currentVotesLength = votes.length;
        pythonVis(votes, (outData) => {
          if (typeof(res) === 'response') {
            res.send(outData);
          }
          db.vizs.create({
            data: outData,
            numVotes: currentVotes
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
}
