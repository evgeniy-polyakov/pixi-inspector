import AttributeParser from "./AttributeParser";

type T = { x: number, y: number };

export default class PointAttributeParser implements AttributeParser<T> {

    constructor(private numberPrecision: number = 2, private factory?: () => T) {
    }

    parse(str: string, value?: T): T {
        if (!value) {
            if (this.factory) {
                value = this.factory();
            } else {
                console.error('Cannot parse attribute from "' + str + '" because factory is not defined.');
                return value;
            }
        }
        let n = str.split(',');
        if (n.length > 1) {
            value.x = parseFloat(n[0]);
            value.y = parseFloat(n[1]);
        } else {
            value.x = value.y = parseFloat(n[0]);
        }
        return value;
    }

    stringify(value: PIXI.Point): string {
        if (value) {
            let x = value.x.toFixed(this.numberPrecision);
            let y = value.y.toFixed(this.numberPrecision);
            return x == y ? x : x + ',' + y;
        }
        return '';
    }

    visible(value: T): boolean {
        return value != null;
    }
}