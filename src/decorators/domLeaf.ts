import DisplayObject = PIXI.DisplayObject;

export default function domLeaf<T extends DisplayObject>() {
    return function (constructor: { new(...args: any[]): T }) {
        constructor.prototype['__pixi_inspector_is_leaf__'] = true;
    }
}