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
    var context = req.payload;
    if(context.jsonGraph !== undefined) {
        context.jsonGraph = JSON.parse(context.jsonGraph);
    }
    if(context.callPath !== undefined) {
        context.callPath = JSON.parse(context.callPath);
    }

    return  context;
};

module.exports = function requestToContext(req) {
    var context = {};
    if (req.method === "get") {
        context = getContext(req);
    }
    else if (req.method === "post") {
        context = postContext(req);
    }
    if (typeof context.paths === "string") {
        context.paths = JSON.parse(context.paths);
    }
    return context;
};
