export function domHidden<T extends PIXI.DisplayObject>() {
    return function (constructor: { new(...args: any[]): T }) {
        constructor.prototype['__pixi_inspector_is_hidden__'] = true;
    }
}