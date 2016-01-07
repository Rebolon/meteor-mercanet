Meteor.startup(() => {
  // code to run on server at startup
  const requiredParams = ["merchant_id", "pathfile_path", "bin_request_path", "bin_response_path"];
  let errors = [];
  _.each(requiredParams, param => {
    if (!Meteor.settings[param]) {
      errors.push(param);
    }
  });

  if (errors.length) {
    let message = errors.join(", ");
    throw new Meteor.Error(`Fill the settings file, missing params: ${ message }`);
  }
});

let prepareArgs = (params) => {
  let args = [];

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

const binary_request = Meteor.settings.bin_request_path;
const binary_response = Meteor.settings.bin_response_path;
const process = Npm.require('child_process');
const execFileSync = Meteor.wrapAsync(process.execFile);

Meteor.methods({
  "mercanet-list-cards": () => {
console.log('mercanet-list-cards');
    // call_request.php
    let args = params, /*_.extend({
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

    let preparedArgs = prepareArgs(args);

    try {
      results = execFileSync(binary_request, preparedArgs);
      resultList = results.split('!');
      code = resultList[1];
      error = resultList[2];
      message = resultList[3];

      if (code == "" && error == "") throw new Meteor.Error('request call error: request binary not found');
      if (code != "0") throw new Meteor.Error(`Payment API error: ${ error }`);

    } catch (e) {
      console.warn(e);
      message = "<form method='post'><button onclick='javascript: FlowRouter.go(\"home\");'></form>";
    }

    return message;
  },

  "mercanet-response": (data) => {
    // call_response.php
    let args = _.extend(_.pick(params, "pathfile"),
      {
        message: data
      }),
      infos,
      results,
      resultList,
      code,
      error;

    let preparedArgs = prepareArgs(args);

    try {
      results = execFileSync(binary_response, preparedArgs);
      resultList = results.split('!');
      code = resultList[1];
      error = resultList[2];
      infos = _.rest(resultList, 3);
console.log("infos", infos);
      if (code == "" && error == "") throw new Meteor.Error('response error: response binary not found');
      if (code != "0") throw new Meteor.Error(`Payment API error: ${ error }`);

    } catch (e) {
      console.warn(e);
    }

    return infos;
  }
});

