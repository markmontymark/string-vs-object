'use strict';

var through2 = require('through2');

module.exports.toJS = function (){
  return through2.obj(function(line,enc,callback){
    if(line){
      //console.error('[toJS] ',JSON.parse(line));
      this.push(JSON.parse(line));
      callback();//null,JSON.parse(line));
      return;
    }
    callback();
  });
};

module.exports.objectThrough = function (fn){
  return through2.obj(function (chunk,enc,callback){
    //var args = Array.prototype.slice.apply([chunk]);
    callback(null,fn.apply(this,[chunk]));
  });
};

module.exports.objectPausedThrough = function (fn){
  return through2.obj(function (chunk,enc,callback){
    this.pause();
    var that = this;
    var done = function (retval){
      callback(null,retval);
      that.resume();
    };
    var args = Array.prototype.slice.apply([chunk]);
    args.push(done);
    fn.apply(this,args);
  });
};


module.exports.simpleThrough = function (fn){
  return through2(function (chunk,enc,callback){
    callback(null,fn.apply(this,[chunk]));
  });
};

module.exports.pausedThrough = function (fn){
  return through2(function (){
    this.pause();
    var that = this;
    var done = function (retval){
      if(retval){
        that.push(retval);
      }
      that.resume();
    };
    var args = Array.prototype.slice.apply(arguments);
    args.push(done);
    fn.apply(this,args);
  });
};
