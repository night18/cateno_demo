Picker.route('/api/:seed', function(params, req, res, next) {
  var targetJson = {"target":5};
  res.end(JSON.stringify(targetJson));
});
