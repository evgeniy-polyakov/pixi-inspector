import fs from 'fs';
import path from 'path';

const dir = './dist';
fs.readdirSync(dir).forEach(file => {
    if (file === 'PixiInspector.d.ts') {
        fs.renameSync(path.join(dir, file), path.join(dir, 'pixi-inspector.d.ts'))
    } else if (/\.d\.ts$/.test(file)) {
        fs.unlinkSync(path.join(dir, file));
    }
});