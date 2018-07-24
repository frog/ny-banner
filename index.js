'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var child_process = require('child_process');
var os = require('os');
var fs = require('fs');
var path = require('path')
var platform = os.platform();

var MODE_INTERVALS = [];
var MODE_QUEUE = [];
var MODE_TIMEOUT = 5; // in seconds

var casesDir;
if (platform.indexOf('win') === 0) {
  casesDir = 'public';
} else {
  casesDir = 'public';
}

function isDirectory(source) {
  if (fs.lstatSync(source).isDirectory()) {
    return true;
  } else {
    return false;
  }
}

function getDirectories(source) {
  var paths = fs.readdirSync(source).map(function(name) {
    return path.join(source, name)
  }).filter(isDirectory).map(function(dirName) {
    if (platform.indexOf('win') === 0) {
      return dirName.split('\\')[1];
    } else {
      return dirName.split('/')[1];
    }
  });
  var assetsIndex = paths.indexOf('assets');
  paths.splice(assetsIndex, 1);
  console.log(paths);
  return paths
}

// get projects from shared folders
var MODE_NAMES = getDirectories(casesDir);

// loop projects
for (var c in MODE_NAMES) {
  MODE_QUEUE.push(MODE_NAMES[c] + '/index.html');
  MODE_INTERVALS.push(MODE_TIMEOUT);
}

var modeLoopingTimeout;
var mode = 0;

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.redirect('gif/index.html');
});

http.listen(3000, function() {
  console.log('listening on *:3000');
  launchApplication();
});

function loopFrom(index) {
  mode = index;
  clearTimeout(modeLoopingTimeout);
  // modeLoopingTimeout = setTimeout(function() {
  //   var nextMode = (mode + 1) % MODE_QUEUE.length;
  //   switchToMode(nextMode);
  //   loopFrom(nextMode);
  // }, MODE_TIMEOUT * 1000);
}

function switchToMode(m) {
  console.log('switch to ', MODE_QUEUE[m]);
  mode = m;
  io.emit('stop', MODE_QUEUE[m]);
}

// run command
function launchApplication() {
  var command;
  // mac platform
  if (platform === 'darwin') {
    command = 'open -a "Google Chrome" http://localhost:3000';
  } // windows platform
  else if (platform.indexOf('win') === 0) {
    command = 'cd C:/Program Files (x86)/Google/Chrome/Application/ && chrome.exe -fullscreen -kiosk -incognito http://localhost:3000';
  }

  child_process.exec(command, function(err) {
    if (err) { //process error
      console.error("ERROR: Failed to launch Chrome!!!", err);
    } else {
      console.log("SUCCESS: Chrome is launched!");
    }
  });
}
