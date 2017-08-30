module.exports.upsert = function(table, values, condition) {
  return table
    .findOne({
      where: condition
    })
    .then(function(obj) {
      if (obj) { // update
        return obj.update(values);
      } else { // insert
        return table.create(values);
      }
    });
}
