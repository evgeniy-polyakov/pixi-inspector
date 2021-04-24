import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/PixiInspector.ts',
    output: {
        name: 'pixi-inspector',
        file: 'dist/pixi-inspector.js',
        format: 'umd',
        compact: true
    },
    plugins: [typescript()],
    external: ['pixi.js']
};