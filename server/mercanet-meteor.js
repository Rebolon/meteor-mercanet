  Meteor.startup(function () {
    // code to run on server at startup
    var requiredParams = ["merchant_id", "pathfile_path", "bin_request_path", "bin_response_path"];
    var errors = [];
    _.each(requiredParams, function(param) {
      if (!Meteor.settings[param]) {
        errors.push(param);
      }
    });

    if (errors.length) {
      throw new Meteor.Error("Fill the settings file, missing params: ", erros.join(", "));
    }
  });

  Meteor.methods({
    "mercanet-list-cards": function() {
      // call_request.php
      var params = {
        "merchant_id": Meteor.settings.merchant_id,
        "merchant_country": "fr",
        "amount": 100,
        "currency_code": 978,
        "pathfile": Meteor.settings.pathfile_path
      }, args = [];

      _.each(_.keys(params), function(key) {
        args.push(key + "=" + params[key]);
      });

      var binary = Meteor.settings.bin_request_path;
      var process = Npm.require('child_process');
      var execFileSync = Meteor.wrapAsync(process.execFile);

      try {
        var results = execFileSync(binary, args);
        var resultList = results.split('!');
        var code = resultList[1];
        var error = resultList[2];
        var message = resultList[3];
console.log(resultList);
        if (code == "" && error == "") throw new Meteor.Error('request call error: request binary not found');
        if (code != "0") throw new Meteor.Error('Payment API error: ' + error);

      }catch (e) {
        console.warn(e);
        var message = "<form method='post'><button onclick='javascript: FlowRouter.go(\"home\");'></form>"; 
      }

      return message;
    }
  });

