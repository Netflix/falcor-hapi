var Hapi = require('hapi');
var FalcorServer = require('falcor-hapi');
var falcor = require('falcor');
var Rx = require('rx');
var Router = require('falcor-router');
var $ref = falcor.Model.ref;

var app = new Hapi.Server();
app.connection({
    host: "localhost",
    port: 9090
});

function TestRouter(request) {
    this._request = request;
}

TestRouter.prototype = new Router([
    {
        route: "titlesById[{integers}].name",
        get: function(pathSet) {
            var titlesById = {}
            pathSet[1].forEach(function(id) {
                titlesById[id] = {
                    name: "Jim" + id
                }
            })
            return Rx.Observable.of({
                jsong: {titlesById: titlesById}
            })
        }
    },
    {
        route: "list[{ranges}]",
        get: function(pathSet) {
            var list = {}
            pathSet[1].forEach(function(range) {
                for (var index = range.from; index <= range.to; index++) {
                    list[index] = $ref(["titlesById", index])
                }
            });
            return Rx.Observable.of({
                jsong: {list: list}
            })
        }
    }
])
var _TestRouter = new TestRouter();

// serve static files (index.html)
app.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: __dirname
        }
    }
});

app.route({
    method: ['GET', 'POST'],
    path: '/model.json',
    handler: FalcorServer.modelRoute(function(req, res) {
        return new TestRouter();
    })
});

app.start(function () {
    console.log('Navigate to:', app.info.uri);
});

