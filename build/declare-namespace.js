var fs = require('fs');
var path = require('path');

var file = fs.readFileSync(path.resolve('./dist/pixi-inspector.d.ts'), 'utf8');

file = file.replace(/^declare\s+module[^{]+\{$/m, 'declare namespace PIXI.inspector {\n');
file = file.replace(/^declare\s+module[^{]+\{$/mg, '');
file = file.replace(/^\s*import\s+.*$\s*/mg, '    ');

ar = file.split(/^\}$/m);
file = ar.slice(0, -1).join('') + '}' + ar[ar.length - 1];

fs.writeFileSync(path.resolve('./dist/pixi-inspector.d.ts'), file);