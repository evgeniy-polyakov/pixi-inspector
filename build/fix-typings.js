const fs = require('fs');
const path = require('path');
//
// let file = fs.readFileSync(path.resolve('./dist/pixi-inspector.d.ts'), 'utf8');
//
// file = file.replace(/^declare\s+module[^{]+\{$/m, 'declare namespace PIXI.inspector {\n');
// file = file.replace(/^declare\s+module[^{]+\{$/mg, '');
// file = file.replace(/^\s*import\s+.*$\s*/mg, '    ');
//
// ar = file.split(/^\}$/m);
// file = ar.slice(0, -1).join('') + '}' + ar[ar.length - 1];
//
// fs.writeFileSync(path.resolve('./dist/pixi-inspector.d.ts'), file);

const dir = './dist';
fs.readdirSync(dir).forEach(file => {
    if (file === 'PixiInspector.d.ts') {
        fs.renameSync(path.join(dir, file), path.join(dir, 'pixi-inspector.d.ts'))
    } else if (/\.d\.ts$/.test(file)) {
        fs.unlinkSync(path.join(dir, file));
    }
});