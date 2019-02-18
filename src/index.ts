if (typeof PIXI === 'undefined') {
    throw "pixi-inspector requires pixi.js to be loaded first";
}

import * as inspector from './inspector';

if (!(PIXI as any).inspector) {
    (PIXI as any).inspector = inspector;
} else {
    for (let prop in inspector) {
        (PIXI as any).inspector[prop] = (inspector as any)[prop];
    }
}

// if in node, export as a node module
declare var module: any;
if (typeof module !== "undefined" && module.exports) {
    module.exports = inspector;
}
