const os = require('os');


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
            cpuLoad
        });
    });
}

performanceData()
    .then((data) => {
        console.log(data);
    })

