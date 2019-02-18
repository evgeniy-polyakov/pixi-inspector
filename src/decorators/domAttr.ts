import DisplayObject = PIXI.DisplayObject;
import {AttributeParser} from "../attributes/AttributeParser";
import {AutoAttributeParser} from "../attributes/AutoAttributeParser";

const __pixi_inspector_class_attributes__ = '__pixi2dom_class_attributes__';
export const __pixi_inspector_attributes__ = '__pixi2dom_attributes__';

export interface DomAttr {
    name: string,
    parser: AttributeParser<any>;
}

export function domAttr<T extends DisplayObject, P>(parser?: AttributeParser<P> | { new(): AttributeParser<P> }) {
    return function (target: T, propertyName: string) {
        if (!target.hasOwnProperty(__pixi_inspector_class_attributes__)) {
            (<any>target)[__pixi_inspector_class_attributes__] = [];
        }
        let classAttributes = (<any>target)[__pixi_inspector_class_attributes__] as DomAttr[];
        if (!classAttributes.some(it => it.name == propertyName)) {
            classAttributes.push({
                name: propertyName,
                parser: typeof parser == 'function' ? new parser() : (parser || new AutoAttributeParser())
            });
        }
        if (!target.hasOwnProperty(__pixi_inspector_attributes__)) {
            Object.defineProperty(target, __pixi_inspector_attributes__, {
                get() {
                    let superClassAttributes = Object.getPrototypeOf(target)[__pixi_inspector_attributes__];
                    if (Array.isArray(superClassAttributes)) {
                        return superClassAttributes.concat(classAttributes);
                    }
                    return classAttributes;
                }
            });
        }
    }
}