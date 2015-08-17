"use strict";

var parseArgs = {
    "jsonGraph": true,
    "callPath": true,
    "arguments": true,
    "pathSuffixes": true,
    "paths": true
};

module.exports = function requestToContext(req) {
    var queryMap = req.method === "post" ? req.payload : req.query;
    var context = {};
    if (queryMap) {
        Object.keys(queryMap).forEach(function(key) {
            var arg = queryMap[key];
            if (parseArgs[key] && arg != null) {
                context[key] = JSON.parse(arg);
            } else {
                context[key] = arg;
            }
        });
    }
    return context;
};
