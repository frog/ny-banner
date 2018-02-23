var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cmd = require('node-cmd');
var os = require('os');
var platform = os.platform();

app.use(express.static('server/public'));

app.get('/', function (req, res) {
  res.redirect('index.html');
});

http.listen(4000, function () {
  console.log('server started on port 4000');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  // start animation
  socket.on('stop', function () {
    console.log('stop application');
    // mac platform
    if (platform === 'darwin') {
      cmd.run("kill $(ps aux | grep '[n]ode index.js' | awk '{print $2}') && kill $(ps aux | grep '[C]hrome' | awk '{print $2}')");
    } // windows platform
    else if (platform.indexOf('win') === 0) {
      // get pid
      'FOR /F "usebackq tokens=5 skip=1 " %i IN (`netstat -ao ^| find "LISTENING" ^| find "3000"`) DO taskkill /PID %~i /F && taskkill /F /IM chrome.exe'
      // cmd.run('FOR /F "usebackq tokens=5 skip=1 " %i IN (`netstat -ao ^| find "LISTENING" ^| find "3000"`) DO taskkill /PIDo %~i /F && taskkill /F /IM firefox.exe');
      // cmd.run('FOR /F "usebackq tokens=5 skip=1 " %i IN (`netstat -ao ^| find "LISTENING" ^| find "3000"`) DO taskkill /PID %~i /F && taskkill /F /IM firefox.exe');
    }
  });
  socket.on('update', function () {
    console.log('update application');
    cmd.get('git pull origin master',
      function(data){
        console.log('git update result:\n\n',data);
      }
    );
  });
  socket.on('start', function () {
    console.log('start application');
    cmd.run('node index.js');
  });
  socket.on('reboot', function () {
    console.log('reboot system');
    // mac platform
    if (platform === 'darwin') {
      cmd.run('shutdown -r now');
    } // windows platform
    else if (platform.indexOf('win') === 0) {
      cmd.run('shutdown -t 0 -r -f');
    }
  });
  socket.on('disconnect', function () {
    console.log('client disconnected');
  });
});
