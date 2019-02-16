import {AttributeParser} from "./AttributeParser";

type T = string | number | boolean | null;

export class PrimitiveAttributeParser implements AttributeParser<T> {

    constructor(private numberPrecision: number = 2) {
    }

    parse(str: string, value?: T): T {
        switch (typeof value) {
            case 'number':
                return parseFloat(str);
            case 'boolean':
                return str == 'true';
            case 'string':
                return str;
        }
        if (str == 'true' || str == 'false') {
            return str == 'true';
        }
        let n = parseFloat(str);
        if (!isNaN(n)) {
            return n;
        }
        return str;
    }

    stringify(value: T): string {
        if (typeof value == 'number') {
            return value.toFixed(this.numberPrecision);
        }
        if (value === false || value) {
            return value.toString();
        }
        return '';
    }

    visible(value: T): boolean {
        return true;
    }
}