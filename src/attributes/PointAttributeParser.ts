import {AttributeParser} from "./AttributeParser";

export class PointAttributeParser implements AttributeParser<{ x: number, y: number }> {

    constructor(private numberPrecision: number = 2, private factory?: () => { x: number, y: number }) {
    }

    parse(str: string, value?: { x: number, y: number }): { x: number, y: number } {
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

    stringify(value: { x: number, y: number }): string {
        if (value) {
            let x = (value.x || 0).toFixed(this.numberPrecision);
            let y = (value.y || 0).toFixed(this.numberPrecision);
            return x == y ? x : x + ',' + y;
        }
        return '';
    }

    visible(value: { x: number, y: number }): boolean {
        return value != null && !isNaN(value.x) && !isNaN(value.y);
    }
}