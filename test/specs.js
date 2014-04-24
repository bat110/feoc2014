/* global describe:true, beforeEach:true, afterEach:true, it:true,
   before:true, after:true */
"use strict";

var yiewd = require('yiewd')
  , chromeOps = require('chrome-ops')
  , path = require('path')
  , httpServer = require('http-server')
  , TouchAction = yiewd.TouchAction
  , o_O = require('monocle-js').o_O
  , mo_Ocha = require('mo_Ocha')
  , it = mo_Ocha.it
  , beforeEach = mo_Ocha.beforeEach
  , afterEach = mo_Ocha.afterEach
  , SWIPE_MS = 0.7;

require('should');

var swipe = o_O(function* (element, startX, startY, endX, endY, duration) {
  var touch = (new TouchAction())
                .press({x: startX, y: startY})
                .wait({ms: duration})
                .moveTo({x: endX, y: endY})
                .release();
  yield element.performTouch(touch);
});

var swipeUp = o_O(function* (element) {
  yield swipe(element, 0.5, 0.9, 0.5, 0.4, SWIPE_MS);
});

var swipeDown = o_O(function* (element) {
  yield swipe(element, 0.5, 0.4, 0.5, 0.9, SWIPE_MS);
});

describe('Sample employee directory app', function () {
  var server;
  var driver;
  var caps = {
    platformName: 'Android'
  , browserName: 'Chrome'
  , platformVersion: '4.4'
  , deviceName: 'Android'
  , enablePerformanceLogging: true
  };

  before(function () {
    server = httpServer.createServer({root: path.resolve(__dirname, "../app/www")});
    server.listen(8080);
  });

  after(function () {
    server.close();
  });

  beforeEach(function* () {
    driver = yiewd.remote('localhost', 4723);
    yield driver.init(caps);
    yield driver.setImplicitWaitTimeout(7000);
  });

  afterEach(function* () {
    yield driver.quit();
  });

  it('should perform well', function* () {
    yield driver.get("http://10.35.4.147:8080/index.html");
    var allLogs = [];
    var perfLogs = yield driver.log('performance');
    allLogs = allLogs.concat(perfLogs);
    var loadTime = chromeOps.durationForNetworkEvents(perfLogs);
    var loadSize = chromeOps.sizeForNetworkEvents(perfLogs);
    console.log("Load time: " + JSON.stringify(loadTime));
    console.log("Load size: " + loadSize);

    yield driver.elementByClassName('topcoat-list__item').click();
    yield driver.waitForElementByClassName('details');
    yield driver.sleep(1000);
    perfLogs = yield driver.log('performance');
    allLogs = allLogs.concat(perfLogs);
    var cpuTime = chromeOps.cpuTimeForTimelineEvents(perfLogs);
    console.log("CPU time used: " + cpuTime);

    yield driver.sleep(1000);
    yield driver.back();
    perfLogs = yield driver.log('performance');
    allLogs = allLogs.concat(perfLogs);
    var memoryUsed = chromeOps.memoryForTimelineEvents(perfLogs);
    console.log("Memory used: " + memoryUsed);

    var contexts = yield driver.contexts();
    var native = contexts[0];
    var web = contexts[1];
    yield driver.context(native);
    var webView = yield driver.elementByClassName("android.widget.FrameLayout");
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        yield swipeUp(webView);
      }
      for (i = 0; i < 3; i++) {
        yield swipeDown(webView);
      }
    }
    yield driver.context(web);
    yield driver.sleep(1000);
    perfLogs = yield driver.log('performance');
    allLogs = allLogs.concat(perfLogs);
    var counts = chromeOps.countsForTimelineEvents(allLogs);
    console.log(counts);
    counts.InvalidateLayout.should.be.below(30);
  });

});
