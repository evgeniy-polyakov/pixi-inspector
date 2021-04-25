const fs = require('fs');
const path = require('path');

const dir = './dist';
fs.readdirSync(dir).forEach(file => {
    if (file === 'PixiInspector.d.ts') {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        content = content.replace(/^\s*import\s+.*$\s*/mg, '');
        fs.writeFileSync(path.join(dir, 'pixi-inspector.d.ts'), content, 'utf-8');
    }
    if (/\.d\.ts$/.test(file)) {
        fs.unlinkSync(path.join(dir, file));
    }
});