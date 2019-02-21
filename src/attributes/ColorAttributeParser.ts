import {AttributeParser} from "./AttributeParser";

export class ColorAttributeParser implements AttributeParser<number> {

    parse(str: string, value?: number): number {
        return parseInt(str.replace('#', '0x'));
    }

    stringify(value: number): string {
        if (!value) {
            return '#000000';
        }
        return '#' + value.toString(16).replace('0x', '');
    }

    visible(value: number | string): boolean {
        return true;
    }
}