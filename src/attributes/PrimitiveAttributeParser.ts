import {AttributeParser} from "./AttributeParser";

export class PrimitiveAttributeParser implements AttributeParser<string | number | boolean | null> {

    constructor(private numberPrecision: number = 2) {
    }

    parse(str: string, value?: string | number | boolean | null): string | number | boolean | null {
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

    stringify(value: string | number | boolean | null): string {
        if (typeof value == 'number') {
            return value.toFixed(this.numberPrecision);
        }
        if (value === false || value) {
            return value.toString();
        }
        return '';
    }

    visible(value: string | number | boolean | null): boolean {
        return true;
    }
}