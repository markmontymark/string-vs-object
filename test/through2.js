
'use strict';

var fs       = require('fs');
var assert   = require('assert');
var split    = require('split');
var helper   = require('..');
var through2 = require('through2');

function echo(v){
  console.error(Buffer.isBuffer(v) ? v.toString('utf-8') : v);
  return v;
}

function objectPredicate(v){
  if(v && typeof v === 'object'){
    return v;
  }
}
function bufferPredicate(v){
  var s = v !== null && v.toString('utf8');
  if(s && s.length && s.length > 10){
    return v;
  }
}

function simpleTest(v){
  assert(v !== null);
  assert(bufferPredicate(v));
  return v;
}

function isObjectTest(v){
  assert(v);
  assert(typeof v === 'object');
  return v;
}

/*global describe,it */
describe('bytes',function(){
  it('simple wrapper',function(){
    // string mode, sync fn
    // works
    fs.createReadStream('test/strings.txt').pipe(
      split()
    ).pipe(
      helper.simpleThrough(bufferPredicate)
    ).pipe(
      helper.simpleThrough(echo)
    ).pipe(
      helper.simpleThrough(simpleTest)
    );
  });

  it('paused wrapper',function(){
    // string mode, gets pause()/resume() mode
    // works
    fs.createReadStream('test/strings.txt').pipe(
      split()
    ).pipe(
      helper.pausedThrough(bufferPredicate)
    ).pipe(
      helper.simpleThrough(echo)
    ).pipe(
      helper.simpleThrough(simpleTest)
    );
  });
});

describe('object',function(){
  it('simple wrapper',function(){
    // string mode, sync fn
    // works
    fs.createReadStream('test/json-per-line.txt').pipe(
      split()
    ).pipe(
      helper.toJS()
    ).pipe(
      helper.objectThrough(bufferPredicate)
    ).pipe(
      helper.objectThrough(echo)
    ).pipe(
      helper.objectThrough(simpleTest)
    ).pipe(
      helper.objectThrough(isObjectTest)
    );
  });

  it('paused wrapper',function(){
    // string mode, gets pause()/resume() mode
    // works
    fs.createReadStream('test/json-per-line.txt').pipe(
      split()
    ).pipe(
      helper.toJS()
    ).pipe(
      helper.objectPausedThrough(bufferPredicate)
    ).pipe(
      helper.objectThrough(echo)
    ).pipe(
      helper.objectThrough(isObjectTest)
    );
  });
});


