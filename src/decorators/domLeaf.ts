export function domLeaf<T extends PIXI.DisplayObject>() {
    return function (constructor: { new(...args: any[]): T }) {
        constructor.prototype['__pixi_inspector_is_leaf__'] = true;
    }
}