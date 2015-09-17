"use strict";
var Boom = require("boom");
var Joi = require("joi");
var FalcorRouter = require("falcor-router");

var requestToContext = require("./requestToContext");
var FalcorEndpoint = module.exports = {};

var internals = {};

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

FalcorEndpoint.register = function (server, options, next) {
    server.handler("falcor", internals.falcorHandler);
    
    next();
};

FalcorEndpoint.register.attributes = {
    pkg: require("../package.json")
};

internals.schema = Joi.object({
    routes: Joi.array().items(
        Joi.object().keys({
          route: Joi.string().required(),
          get: Joi.func().optional(),
          set: Joi.func().optional(),
          call: Joi.func().optional()
        }).or("get", "set", "call")
    ).required(),
    cacheRoutes: Joi.boolean().default(true),
    options: Joi.object().optional(),
    initialize: Joi.func().optional(),
    routerClass: Joi.func().optional()
}).nand("initialize", "routerClass");


internals.falcorHandler = function(route, options) {
    Joi.assert(options, internals.schema, "Invalid falcor handler options (" + route.path + ")");
    options = Joi.validate(options, internals.schema).value;

    var StatefulRouter;
    if(options.cacheRoutes) {
        StatefulRouter = internals.createStatefulRouter(FalcorRouter.createClass(options.routes), options);
    }

    return FalcorEndpoint.dataSourceRoute(function(req, reply) {
        if(!StatefulRouter) {
            var Router = internals.createStatefulRouter(FalcorRouter.createClass(options.routes), options);
            return new Router(req, reply);
        }

        return new StatefulRouter(req, reply);
    });
};

internals.createStatefulRouter = function(StatelessRouter, options) {
    if(options.routerClass) {
        internals.mixin(options.routerClass.prototype, new StatelessRouter(options.options));
        return options.routerClass;
    }

    function C(req, reply) {
        this.req = req;
        this.reply = reply;
        if(options.initialize) {
            options.initialize.apply(this);
        }
    }

    C.prototype = new StatelessRouter(options.options);
    C.prototype.contructor = C;

    return C;
};

internals.mixin = function(target, source) {
   target = target || {};

   for (var prop in source) {
       // Never override existing properties / methods from the target
       if(typeof target[prop] === "undefined"){
           if (typeof source[prop] === "object") {
               target[prop] = internals.mixin(target[prop], source[prop]);
           } else {
               target[prop] = source[prop];
           }
       }
   }
   return target;
};
