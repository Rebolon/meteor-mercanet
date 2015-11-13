Package.describe({
  name: 'rebolon:middleware-bodyparser',
  summary: 'return the bodyParser middleware from npm',
  version: '0.0.1',
  git: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.addFiles(['package.js'], ['server']);

  api.export([
    'MiddlewareBodyParser'
  ], ['server']);
});

Npm.depends({
  'body-parser': '1.14.1'
});
