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
      method: 'GET',
      json: true,
      body: data
  }, function (error, response, body) {
    console.log('HERE: ' + JSON.stringify(response));
    if (!error) {
      success(response);
    }
  });
}
