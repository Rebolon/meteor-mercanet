var postRoutes = Picker.filter(function(req, res) {
  return req.method == "POST";
}), bodyParser = Npm.require("rebolon:middleware_bodyparser");

postRoutes.use(bodyParser.urlencoded({ extended: false }))

postRoutes.route('/comebackhome/', function(params, req, res, next) {

  console.log(_.keys(req));

  res.end(post.content);
});