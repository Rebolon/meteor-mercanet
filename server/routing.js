let postRoutes = Picker.filter(function(req, res) {
  return req.method == "POST";
});

postRoutes.middleware(MiddlewareBodyParser.urlencoded({ extended: false }));
postRoutes.middleware(MiddlewareBodyParser.raw({}));

postRoutes.route('/orderpayedautoresponse/', function(params, req, res, next) {
  // in the method you must store order status... and do what you need
  let id = Meteor.call('mercanet-response', req.body.DATA);

  console.info(`autoresponse id ${id}`);

  res.end();
});

postRoutes.route('/orderpayed/', function(params, req, res, next) {
  // in the method you must store order status... and do what you need
  let id = Meteor.call('mercanet-response', req.body.DATA);

  // then you redirect the user
  res.writeHead(303, {
    'Location': `${Meteor.settings.server_uri}/bank/paid/${id}`
  });
  res.end();
});

postRoutes.route('/ordercancelled/', function(params, req, res, next) {
  let id = Meteor.call('mercanet-response', req.body.DATA)

  // then you redirect the user
  res.writeHead(303, {
    'Location': `${Meteor.settings.server_uri}/bank/fail/${id}`
  });
  res.end();
});