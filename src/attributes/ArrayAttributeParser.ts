import {AttributeParser} from "./AttributeParser";
import {PrimitiveAttributeParser} from "./PrimitiveAttributeParser";

class ArrayAttributeParser<T> implements AttributeParser<T[]> {

    private elementParser: AttributeParser<T>;

    constructor(elementParser?: AttributeParser<T> | { new(): AttributeParser<T> },
                private delimiter = ',') {
        this.elementParser = typeof elementParser == 'function'
            ? new elementParser()
            : (elementParser || <any>(new PrimitiveAttributeParser()));
    }

    parse(str: string, value?: T[]): T[] {
        if (!Array.isArray(value)) {
            value = [];
        }
        let i = 0;
        let a = str.split(this.delimiter);
        let n = Math.min(value.length, a.length);
        for (i; i < n; i++) {
            value[i] = this.elementParser.parse(a[i], value[i]);
        }
        n = a.length;
        for (i; i < n; i++) {
            value[i] = this.elementParser.parse(a[i]);
        }
        while (value.length > n) {
            value.pop();
        }
        return value;
    }

    stringify(value: T[]): string {
        if (Array.isArray(value)) {
            return value.map(it => this.elementParser.stringify(it)).join(this.delimiter);
        }
        return '';
    }

    visible(value: T[]): boolean {
        return Array.isArray(value);
    }
}