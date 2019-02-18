import {AttributeParser} from "./AttributeParser";

export interface DomAttribute {
    name: string,
    parser: AttributeParser<any>;
}