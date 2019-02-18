export interface AttributeParser<T> {
    parse(str: string, value?: T): T;
    stringify(value: T): string;
    visible(value: T): boolean;
}