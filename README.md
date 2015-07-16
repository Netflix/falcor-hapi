# falcor-hapi
Server middleware for falcor-hapi

Working usage example of the basic repro in example/

## Usage
Minimalistic example

```
var FalcorServer = require('falcor-hapi');
var Hapi = require('hapi');
var TestRouter = <your router here>;
var _TestRouter = new TestRouter();

var app = new Hapi.Server();
app.connection({
    host: "localhost",
    port: 9090
});

app.route({
    method: ['GET', 'POST'],
    path: '/model.json',
    handler: FalcorServer.modelRoute(function(req, res) {
        return new TestRouter();
    })
);
app.start();

```

## Development
To develop this server further run
```
clone repo
npm install
```
then go in the test example folder, copy ``falcor.browser.js`` from your ``falcor/dist`` and run
```
npm install
npm start
```
You might want to symlink falcor-hapi inside your node_modules to the local version rather than the github/npm one.

Please run linting before pushing on repo
```
npm run lint
```

## Todo
 * Create mocha test for regression and development instad of using example  
 * Test post parameters once set/call are developed  
 