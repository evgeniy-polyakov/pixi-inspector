import DisplayObject = PIXI.DisplayObject;

export default function domHidden<T extends DisplayObject>() {
    return function (constructor: { new(...args: any[]): T }) {
        constructor.prototype['__pixi_inspector_is_hidden__'] = true;
    }
}