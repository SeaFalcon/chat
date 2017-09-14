var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client.html');
});
var userList = {};
var count = 1;
io.on('connection', socket => {
	console.log(io.engine.clientsCount, io.sockets.sockets);
	var name = 'user' + count++;
	console.log('user connectied: ', name);
	userList[name] = socket.id;
	io.to(socket.id).emit('set_name', name);
	io.emit('connect_user', Object.keys(userList));

	socket.on('disconnect', () => {
		var disUser = Object.keys(userList).find(id => userList[id] == socket.id);
		console.log('user disconnected: ', disUser);
		io.emit('disconnect_user', disUser);
		delete userList[disUser];
		console.log(userList);
	});

	socket.on('send message', (name, text) => {
		var msg = `${name} : ${text}`;
		console.log(msg);
		io.emit('receive message', msg);
	});
});

http.listen(3000, () => {
	console.log('server on!');
});

//clients: [Object],
//clientsCount: 2,
