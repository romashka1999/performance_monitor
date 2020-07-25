const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/perfomanceData', {useNewUrlParser: true, useUnifiedTopology: true});

const Machine = require('./models/Machine');

function socketMain(io, socket) {
    let macAddress;
    // what rype clients joined
    socket.on('clientAuth', (key) => {
        if(key === '32453gdfgd56y7SFHGFH6') {
            socket.join('clients');
        } else if(key === 'asdfergssg2r34sf') {
            socket.join('ui');
        } else {
            socket.disconnect(true);
        }
    });

    socket.on('initPerfData', async (data) => {
        macAddress = data.macAddress;
        const mongooseResponse = await checkAndAdd(data);
        console.log(mongooseResponse);
    });

    socket.on('perfData', (data) => {
        console.log(data);
    });
}

function checkAndAdd(data) {
    return new Promise(async (resolve, reject) => {
        try {
            const machine = await Machine.findOne({macAddress: data.macAddress});
            if(machine === null) {
                await Machine.create(data);
                resolve('added');
            } else {
                resolve('found');
            }
        } catch (error) {
            throw error;
        } 
    });
}

module.exports = socketMain;