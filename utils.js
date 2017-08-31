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
