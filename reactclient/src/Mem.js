import React from 'react'
import drawCircle from './utilities/canvasLoadAnimation';

export default function Mem(props) {

    const {totalMemory, freeMemory, usedMemory, memoryUsage} = props.memData;
    const canvas = document.querySelector('.memCanvas');
    drawCircle(canvas, memoryUsage * 100);

    return (
        <div>
            <div className ="col-sm-3 mem">
                <h3>Memory usage</h3>
                <div className="canvas-wrapper">
                    <canvas className="memCanvas" width="200" height="200"></canvas>
                    <div className="mem-text">{(memoryUsage * 100).toFixed(0)}%</div>
                </div>
                <div>
                    ToTal Memory: {Math.floor(totalMemory/1073741824*100)/100}gb
                </div>
                <div>
                    Free Memory: {Math.floor(freeMemory/1073741824*100)/100}gb
                </div>
            </div>
        </div>
    )
}
