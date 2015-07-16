"use strict";

var getContext = function (req) {
    // todo: not sure if in the below line should copy this object, or force Joi validation conversion
    // perhaps it"s irrelevant, and this is more performant, verify.
    var context = req.query;
    // as far as i know, params cannot contain nested objects so this should be safe
    for (var key in context) {
        if ({}.hasOwnProperty.call(context, key)) {
            context[key] = decodeURIComponent(context[key]);
            if (key === "path") {
                context[key] = JSON.parse(context[key]);
            }
        }
    }
    return context;
};

var postContext = function(req) {
    var queryString = req.payload;
    var context = {};
    // todo: improve this
    if (queryString) {
        context = queryString.split("&").reduce(function(acc, q) {
            var queryParam = q.split("=");
            acc[queryParam[0]] = decodeURIComponent(queryParam[1]);
            if (queryParam[0] === "path") {
                // optional, Falcor endpoint will take care of that.
                acc[queryParam[0]] = JSON.parse(acc[queryParam[0]]);
            }
            return acc;
        }, {});
    }
    return context;
};

module.exports = function requestToContext(req) {
    var context = {};
    if (req.method === "get") {
        context = getContext(req);
    }
    else if (req.method === "post") {
        context = postContext(req);
    }
    if (typeof context.path === "string") {
        context.path = JSON.parse(context.path);
    }
    return context;
};
