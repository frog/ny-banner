(function(){
	// socket IO switch mode
	var socket = io();
	socket.on('stop', function(msg) {
		window.location.href = '/' + msg;
	});
})();
