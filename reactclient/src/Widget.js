import React from 'react';

import Cpu from './Cpu';
import Mem from './Mem';
import Info from './Info';

export default function Widget(props) {
    const { freeMemory, totalMemory, usedMemory, memoryUsage, osType,
        upTime, numCores, cpuModel, cpuSpeed, cpuLoad, macAddress, isActive } = props.data;

    const cpuWidgetId = `cpu-widget-${macAddress}`;
    const memWidgetId = `mem-widget-${macAddress}`;

    const cpu = {cpuLoad, cpuWidgetId};
    const mem = {totalMemory, freeMemory, usedMemory, memoryUsage, memWidgetId};
    const info = {macAddress, osType, upTime, cpuModel, numCores, cpuSpeed};

    let notActiveDiv = '';
    if(isActive) {
        notActiveDiv = <div className="not-active">Offline</div>
    }

    

    return (
        <div className="widget col-sm-12">
            {notActiveDiv}
            <Cpu cpuData={cpu}/>
            <Mem memData = {mem}/>
            <Info infoData = {info}/>
        </div>
    )
}
