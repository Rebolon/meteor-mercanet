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

Meteor.methods({
  "mercanet-list-cards": () => {
    // call_request.php
    let params = {
      "merchant_id": Meteor.settings.merchant_id,
      "merchant_country": "fr",
      "amount": 100,
      "currency_code": 978,
      "pathfile": Meteor.settings.pathfile_path
    }, 
      args = [],
      message,
      results,
      code,
      error;

    _.each(_.keys(params), function(key) {
      args.push(key + "=" + params[key]);
    });

    const binary = Meteor.settings.bin_request_path;
    const process = Npm.require('child_process');
    const execFileSync = Meteor.wrapAsync(process.execFile);

    try {
      results = execFileSync(binary, args);
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
  }
});

