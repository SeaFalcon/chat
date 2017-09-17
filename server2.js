var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client2.html');
});
var userList = {};
var count = 1;
io.on('connection', socket => {
	io.clients((err, clients) => {
		if(err) throw err;
		clients.forEach(client => {userList[client] = '';})
		console.log('clients', userList);
	});

	var name = 'user' + count++;
	console.log('user connectied: ', name);
	userList[name] = socket.id;
	io.to(socket.id).emit('set_name', name);
	io.emit('connect_user', userList);

	socket.on('enter_name', (name) => {

	});

	socket.on('disconnect', () => {
		var disUser = findUser(userList, socket);
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

	socket.on('change_name', newName => {
		var name = findUser(userList, socket);
		delete userList[name];
		userList[newName] = socket.id;
		console.log(`NickName ${name} => ${newName} change!`);
		io.emit('alert_change_name', Object.keys(userList), name, newName);
	});
});

function findUser(userList, socket){
	return Object.keys(userList).find(id => userList[id] == socket.id);
}

http.listen(3000, () => {
	console.log('server on!');
});

//clients: [Object],
//clientsCount: 2,
