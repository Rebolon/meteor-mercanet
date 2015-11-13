var postRoutes = Picker.filter(function(req, res) {
  return req.method == "POST";
});

postRoutes.middleware(MiddlewareBodyParser.urlencoded({ extended: false }));
postRoutes.middleware(MiddlewareBodyParser.raw({}));

postRoutes.route('/orderpayedautoresponse/', function(params, req, res, next) {
  // in the method you must store order status... and do what you need
  Meteor.call('mercanet-response', req.body.DATA);
  res.end();
});

postRoutes.route('/orderpayed/', function(params, req, res, next) {
  // in the method you must store order status... and do what you need
  Meteor.call('mercanet-response', req.body.DATA);

  // then you redirect the user
  res.writeHead(303, {
    'Location': 'http://51.254.223.11:3000/cool'
  });
  res.end();
});

postRoutes.route('/ordercancelled/', function(params, req, res, next) {
  Meteor.call('mercanet-response', req.body.DATA)

  // then you redirect the user
  res.writeHead(303, {
    'Location': 'http://51.254.223.11:3000/pascooldutout'
  });
  res.end();
});