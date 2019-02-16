import DisplayObject = PIXI.DisplayObject;

export const __pixi_inspector_is_leaf__ = '__pixi2dom_is_leaf__';

export function domLeaf<T extends DisplayObject>() {
    return function (constructor: { new(...args: any[]): T }) {
        constructor.prototype[__pixi_inspector_is_leaf__] = true;
    }
}