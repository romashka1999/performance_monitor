const os = require('os');
const io = require('socket.io-client');

const socket = io('http://127.0.0.1:8181');

socket.on('connect', () => {
    const nI = os.networkInterfaces();
    let macAddress;
    for (const key in nI) {
        if(!nI[key][0].internal) {
            if(nI[key][0].mac === '00:00:00:00:00:00') {
                macAddress = Math.random().toString(36).substr(2, 15);
            } else {
                macAddress = nI[key][0].mac;
            }
            break;
        }
    }

    socket.emit('clientAuth', '32453gdfgd56y7SFHGFH6');

    performanceData()
            .then((perfData) => {
                perfData.macAddress = macAddress;
                socket.emit('initPerfData', perfData);
            })

    
    let perfomanceDataInterval = setInterval(() => {
        performanceData()
            .then((perfData) => {
                perfData.macAddress = macAddress;
                socket.emit('perfData', perfData);
                console.log('emitted from nodeclient');
            })
    }, 1000);

    socket.on('disconnect', () => {
        clearInterval(perfomanceDataInterval);
    });
});


function cpuAvarage() {
    let idleMs = 0;
    let totalMs = 0;
    os.cpus().forEach((core) => {
        for (const type in core.times) {
            totalMs += core.times[type];
        }
        idleMs += core.times.idle;
    });
    return {
        idle: idleMs / os.cpus().length,
        total: totalMs / os.cpus().length
    }
}

function getCpuLoad(milliseconds = 100) {
    return new Promise((resolve, reject) => {
        const start = cpuAvarage();
        setTimeout(() => {
            const end = cpuAvarage();
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;

            const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference);
            resolve(percentageCpu);
        }, milliseconds);
    });
}


function performanceData() {
    return new Promise(async (resolve, reject) => {
        const osType = os.type() === 'Darwin' ? 'Mac' : os.type() === 'Windows_NT' ? 'Windows' : os.type();
        const upTime = os.uptime();
        const freeMemory = os.freemem();
        const totalMemory = os.totalmem();

        const usedMemory = totalMemory - freeMemory;
        const memoryUsage = Math.floor(usedMemory / totalMemory * 100) / 100;

        const cpuModel = os.cpus()[0].model;
        const cpuSpeed = os.cpus()[0].speed;
        const numCores = os.cpus().length;

        const cpuLoad = await getCpuLoad();
        const isaActive = true;
        resolve({
            freeMemory,
            totalMemory,
            usedMemory,
            memoryUsage,
            osType,
            upTime,
            numCores,
            cpuModel,
            cpuSpeed,
            cpuLoad,
            isaActive
        });
    });
}



