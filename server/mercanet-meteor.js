Meteor.startup(function() {
  // code to run on server at startup
  var requiredParams = ["merchant_id", "pathfile_path", "bin_request_path", "bin_response_path"];
  var errors = [];
  _.each(requiredParams, function(param) {
    if (!Meteor.settings[param]) {
      errors.push(param);
    }
  });

  if (errors.length) {
    var message = errors.join(", ");
    throw new Meteor.Error('Fill the settings file, missing params: ' + message);
  }
});

var prepareArgs = function (params) {
  var args = [];

  _.each(_.keys(params), function(key) {
    args.push(key + "=" + params[key]);
  });

  return args;
}, params = {
    "merchant_id": Meteor.settings.merchant_id,
    "merchant_country": "fr",
    "amount": 100,
    "currency_code": 978,
    "pathfile": Meteor.settings.pathfile_path,
    "normal_return_url": "http://51.254.223.11:3000/orderpayed",
    "cancel_return_url": "http://51.254.223.11:3000/ordercancelled",
    "automatic_response_url": "http://51.254.223.11:3000/orderpayedautoresponse"
};

var binary_request = Meteor.settings.bin_request_path;
var binary_response = Meteor.settings.bin_response_path;
var process = Npm.require('child_process');
var execFileSync = Meteor.wrapAsync(process.execFile);

Meteor.methods({
  "mercanet-list-cards": function() {
    // call_request.php
    var args = params, /*_.extend({
        "transaction_id": (new Date()).getTime(),// is it enough ? tid should be uniq... so the order._id
        "order_id": "",
        "customer_id": "",
        "return_context": {}.stringify(),
        "data": {}.stringify()
      }, params),*/
      message,
      results,
      resultList,
      code,
      error;

    var preparedArgs = prepareArgs(args);

    try {
      results = execFileSync(binary_request, preparedArgs);
      resultList = results.split('!');
      code = resultList[1];
      error = resultList[2];
      message = resultList[3];

      if (code == "" && error == "") throw new Meteor.Error('request call error: request binary not found');
      if (code != "0") throw new Meteor.Error('Payment API error: ' + error);

    } catch (e) {
      console.warn(e);
      message = "<form method='post'><button onclick='javascript: FlowRouter.go(\"home\");'></form>";
    }

    return message;
  },

  "mercanet-response": function(data) {
    // call_response.php
    var args = _.extend(_.pick(params, "pathfile"),
      {
        message: data
      }),
      infos,
      results,
      resultList,
      code,
      error;

    var preparedArgs = prepareArgs(args);

    try {
      results = execFileSync(binary_response, preparedArgs);
      resultList = results.split('!');
      code = resultList[1];
      error = resultList[2];
      infos = _.rest(resultList, 3);
console.log("infos", infos);
      if (code == "" && error == "") throw new Meteor.Error('response error: response binary not found');
      if (code != "0") throw new Meteor.Error('Payment API error: ' + error);

    } catch (e) {
      console.warn(e);
    }

    return infos;
  }
});

