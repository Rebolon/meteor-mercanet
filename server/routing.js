var postRoutes = Picker.filter(function(req, res) {
  return req.method == "POST";
});

postRoutes.middleware(MiddlewareBodyParser.urlencoded({ extended: false }));
postRoutes.middleware(MiddlewareBodyParser.raw({}));

postRoutes.route('/orderpayed/', function(params, req, res, next) {
  Meteor.call('mercanet-response', req.body.DATA)
  res.end();
});

postRoutes.route('/ordercancelled/', function(params, req, res, next) {
  Meteor.call('mercanet-response', req.body.DATA)
  res.end();
});