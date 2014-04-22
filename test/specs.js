/* global describe:true */
"use strict";

var mo_Ocha = require('mo_ocha')
  , yiewd = require('yiewd')
  , it = mo_Ocha.it
  , beforeEach = mo_Ocha.beforeEach
  , afterEach = mo_Ocha.afterEach
  , path = require('path');

require('should');

describe('Sample employee directory app', function () {

  var driver;
  var caps = {
    platformName: 'Android'
  , platformVersion: '4.4'
  , deviceName: 'Android'
  , app: path.resolve(__dirname, '../app/platforms/android/ant-build/' +
                                 'SampleApp-debug.apk')
  };

  beforeEach(function* () {
    driver = yiewd.remote('localhost', 4723);
    yield driver.init(caps);
  });

  afterEach(function* () {
    yield driver.quit();
  });

  it('should launch the app', function* () {
    var contexts = yield driver.contexts();
    contexts.length.should.equal(2);
    yield driver.context(contexts[1]);
    //console.log(yield driver.source());
  });

});
