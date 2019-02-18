import AttributeParser from "./AttributeParser";
import PrimitiveAttributeParser from "./PrimitiveAttributeParser";
import ArrayAttributeParser from "./ArrayAttributeParser";

export default class AutoAttributeParser implements AttributeParser<any> {

    private arrayAttributeParser = new ArrayAttributeParser<any>();
    private primitiveAttributeParser = new PrimitiveAttributeParser();

    parse(str: string, value?: any): any {
        if (Array.isArray(value)) {
            return this.arrayAttributeParser.parse(str, value);
        }
        return this.primitiveAttributeParser.parse(str, value);
    }

    stringify(value: any): string {
        if (Array.isArray(value)) {
            return this.arrayAttributeParser.stringify(value);
        }
        return this.primitiveAttributeParser.stringify(value);
    }

    visible(value: any): boolean {
        return true;
    }
}