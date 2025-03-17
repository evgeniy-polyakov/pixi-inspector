import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/PixiInspector.ts",
    output: [
        {
            name: "pixi-inspector",
            file: "dist/pixi-inspector.js",
            format: "umd",
            compact: true,
            globals: {
                "pixi.js": "PIXI"
            }
        },
        {
            file: "dist/pixi-inspector.mjs",
            format: "es",
            compact: true,
            globals: {
                "pixi.js": "PIXI"
            }
        },
    ],
    plugins: [typescript()],
    external: ["pixi.js"]
};