const mongoose = require('mongoose');

const MachineSchema =  new mongoose.Schema({
    macAddress: String,
    cpuLoad: Number,
    freeMemory: Number,
    totalMemory: Number,
    usedMemory: Number,
    memoryUsage: Number,
    osType: String,
    upTime: Number,
    cpuModel: String,
    numCores: Number,
    cpuSpeed: Number
});

module.exports = mongoose.model('Machine', MachineSchema);