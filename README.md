# falcor-hapi
Server middleware for falcor-hapi

Working usage example in [falcor-hapi-demo](https://github.com/netflix/falcor-hapi-demo) repo

## Usage
Minimalistic example

```
var FalcorServer = require('falcor-hapi');
var Hapi = require('hapi');
var TestRouter = <your router here>;

var app = new Hapi.Server();
app.connection({
    host: "localhost",
    port: 9090
});

app.route({
    method: ['GET', 'POST'],
    path: '/model.json',
    handler: FalcorServer.dataSourceRoute(function(req, res) {
        return new TestRouter();
    })
});
app.start();
```

## Hapi Plugin Usage
You can also register this module as an Hapi Plugin and use its provided Falcor handler.

#### Features

 * Provides restful router with cached routes out of the box.
 * Both the Hapi Request and Reply are available within your routes as `this.req` and `this.reply`.
 * Validates your routes with JOI.
 * You can provide your own initialize method to the router.
 * Alternately, you can provide your own Router class and the handler will mixin the logic to cache your routes and the base Falcor router class.

 ```
 var Hapi = require('hapi');

 var app = new Hapi.Server();
 app.connection({
     host: "localhost",
     port: 9090
 });

 app.register(require('falcor-hapi'), function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }

    app.route({
      method: ['GET', 'POST'],
      path: '/model.json',
      handler: {
          falcor: {
              routes: routes,                                         // Your routes
              cacheRoutes: true,                                      // Whether to cache your routes, default to true
              options: {debug: true},                                 // Option to give to Falcor router
              initialize: function() {                                // Optional initialize method
                 this.foo = this.req.payload.meaningoflife || 42;
              },
              routerClass: MyRouterClass                              // Optional routerClass to use
          }
      }
    });

    app.start();
});
```

## Development
Please run linting before pushing on repo
```
npm run lint
```

## Todo
 * Create mocha test for regression and development instead of using example
