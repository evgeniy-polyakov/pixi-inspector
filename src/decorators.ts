import {AttributeParser} from "./attributes/AttributeParser";
import {AutoAttributeParser} from "./attributes/AutoAttributeParser";

export function domAttr<T extends PIXI.DisplayObject, P>(parser?: AttributeParser<P> | { new(): AttributeParser<P> }) {
    return function (target: T, propertyName: string) {
        if (!target.hasOwnProperty('__pixi_inspector_class_attributes__')) {
            (<any>target)['__pixi_inspector_class_attributes__'] = [];
        }
        let classAttributes = (<any>target)['__pixi_inspector_class_attributes__'] as { name: string, parser: AttributeParser<any> }[];
        if (!classAttributes.some(it => it.name == propertyName)) {
            classAttributes.push({
                name: propertyName,
                parser: typeof parser == 'function' ? new parser() : (parser || new AutoAttributeParser())
            });
        }
        if (!target.hasOwnProperty('__pixi_inspector_attributes__')) {
            Object.defineProperty(target, '__pixi_inspector_attributes__', {
                get() {
                    let superClassAttributes = Object.getPrototypeOf(target)['__pixi_inspector_attributes__'];
                    if (Array.isArray(superClassAttributes)) {
                        return superClassAttributes.concat(classAttributes);
                    }
                    return classAttributes;
                }
            });
        }
    }
}

export function domHidden<T extends PIXI.DisplayObject>() {
    return function (constructor: { new(...args: any[]): T }) {
        constructor.prototype['__pixi_inspector_is_hidden__'] = true;
    }
}

export function domLeaf<T extends PIXI.DisplayObject>() {
    return function (constructor: { new(...args: any[]): T }) {
        constructor.prototype['__pixi_inspector_is_leaf__'] = true;
    }
}