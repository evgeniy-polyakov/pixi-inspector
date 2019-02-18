import AttributeParser from "./AttributeParser";

export default interface DomAttribute {
    name: string,
    parser: AttributeParser<any>;
}