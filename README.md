# falcor-hapi
Server middleware for falcor-hapi

Working usage example of the basic repro in falcor-hapi-demo/

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

## Development
Please run linting before pushing on repo
```
npm run lint
```

## Todo
 * Create mocha test for regression and development instad of using example

