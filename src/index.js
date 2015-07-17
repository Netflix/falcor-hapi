"use strict";
var Boom = require("boom");
var requestToContext = require("./requestToContext");
var FalcorEndpoint = module.exports = {};

FalcorEndpoint.dataSourceRoute = function(getDataSource) {
    return function(req, reply) {
        var obs;
        var dataSource = getDataSource(req, reply);
        var context = requestToContext(req);
        // probably this should be sanity check function?
        if (Object.keys(context).length === 0) {
            return reply(Boom.badRequest("Request not supported"));
        }
        if (typeof context.method === "undefined" || context.method.length === 0) {
            return reply(Boom.badRequest("No query method provided"));
        }
        if (typeof dataSource[context.method] === "undefined") {
            return reply(Boom.badRequest("Data source does not implement the requested method"));
        }
        if (context.method === "set") {
            obs = dataSource[context.method](context.jsonGraph);
        } else if (context.method === "call") {
            obs = dataSource[context.method](context.callPath, context.arguments, context.pathSuffixes, context.paths);
        } else {
            obs = dataSource[context.method]([].concat(context.paths));
        }
        obs.subscribe(function(jsonGraphEnvelope) {
            reply(jsonGraphEnvelope);
        }, function(err) {
            reply(err);
        });
    };
};
