const express = require('express');
const cluster = require('cluster');
const net = require('net');
const socketio = require('socket.io');
// const helmet = require('helmet')
const socketMain = require('./socketMain');
// const expressMain = require('./expressMain');

const port = 8181;
const num_processes = require('os').cpus().length;

const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');

if (cluster.isMaster) {
	const workers = [];

	const spawn = function(i) {
		workers[i] = cluster.fork();
		workers[i].on('exit', function(code, signal) {
			spawn(i);
		});
    };

	for (var i = 0; i < num_processes; i++) {
		spawn(i);
	}

	const worker_index = function(ip, len) {
		return farmhash.fingerprint32(ip) % len;
	};

	const server = net.createServer({ pauseOnConnect: true }, (connection) => {
		const worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
    });

    server.listen(port);
    console.log(`Master listening on port ${port}`);
} else {
    const app = express();
    // app.use(express.static(__dirname + '/public'));
    // app.use(helmet());
    
    const server = app.listen(0, 'localhost');
    // console.log("Worker listening...");    
	const io = socketio(server);

	io.adapter(io_redis({ host: 'localhost', port: 6379 }));

    io.on('connection', function(socket) {
		socketMain(io, socket);
		console.log(`connected to worker: ${cluster.worker.id}`);
    });


	process.on('message', function(message, connection) {
		if (message !== 'sticky-session:connection') {
			return;
		}

		server.emit('connection', connection);

		connection.resume();
	});
}