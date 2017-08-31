'use strict';

var url = require('url');
var async = require('async');
var _ = require('lodash');
var authenticate = require(__dirname + '/authenticate');
var exportTemplate = require(__dirname + '/exportTemplate');

module.exports = function(options, next) {
  var steps = [];


  Date.prototype.FileFormat = function () {
    var yyyy = this.getFullYear().toString();
    var MM = pad(this.getMonth() + 1,2);
    var dd = pad(this.getDate(), 2);
    var hh = pad(this.getHours(), 2);
    var mm = pad(this.getMinutes(), 2)
    var ss = pad(this.getSeconds(), 2)

    return yyyy + MM + dd+  hh + mm + ss;
  };
  function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
  // Setup the source options.
  var srcOptions = _.clone(options);
  srcOptions.project = options.params[0];
  srcOptions.formio = options.srcFormio;
  if (srcOptions.project.indexOf('.json') !== -1) {
    return next('Cannot use json file as a source');
  }
  else {
    steps.push(_.partial(exportTemplate, srcOptions));
  }

  // Copy the template from source to destination.
  steps.push(_.partial(function(src, next) {
    var timestamp = new Date();
    var fileName = "backup-" + timestamp.FileFormat() + ".json";
    var fs = require('fs');
+   fs.writeFile(fileName, JSON.stringify(src.template), function(err){
        if(err){
            return next(err);
        }
        console.log('Success');
        next();
    });
  }, srcOptions));

  
  async.series(steps, next);
};
