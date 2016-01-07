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
    "normal_return_url": `${Meteor.settings.server_uri}/orderpayed`,
    "cancel_return_url": `${Meteor.settings.server_uri}/ordercancelled`,
    "automatic_response_url": `${Meteor.settings.server_uri}/orderpayedautoresponse`
};

const binary_request = Meteor.settings.bin_request_path;
const binary_response = Meteor.settings.bin_response_path;
const process = Npm.require('child_process');
const execFileSync = Meteor.wrapAsync(process.execFile);

Meteor.methods({
  "mercanet-list-cards": () => {
console.log('mercanet-list-cards');
    // call_request.php
    let orderId = (new Mongo.ObjectID())._str,
	customerId = (new Mongo.ObjectID())._str,
        args = /*params,*/_.extend({
//        "transaction_id": (new Date()).getTime(),// it is not enough so we also need an order_id and a cusomer_id, both are the main key of the transaction. Transaction_id should be an autoincrement concat with the YYYYMMDD to get something uniq per day
        "data": JSON.stringify({
          "order_id": orderId,
          "customer_id": customerId
        })
      }, params),
      message,
      results,
      resultList,
      code,
      error;

    let preparedArgs = prepareArgs(args);
console.log(preparedArgs);
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

    if (!infos[29]) {
      let errMsg = "Payment unwished transaction, missing index 29 with contextual data";
      console.error(errMsg);
      throw new Meteor.Error(errMsg);
    }

    let context = JSON.parse(infos[29]),
        payment = Payments.findOne({"context.orderId": context.orderId, "context.customerId": context.customerId}),
        id;

    if (!payment) {
      id = Payments.insert(_.extend({response: {error: error, code: code, data: data}, infos: infos, context: context}));
    } else {
      id = payment._id;
    }

    return id;
  }
});

