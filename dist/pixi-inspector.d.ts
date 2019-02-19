/// <reference types="pixi.js" />
declare namespace PIXI.inspector {

    export interface AttributeParser<T> {
        parse(str: string, value?: T): T;
        stringify(value: T): string;
        visible(value: T): boolean;
    }
    export class PrimitiveAttributeParser implements AttributeParser<string | number | boolean | null> {
        private numberPrecision;
        constructor(numberPrecision?: number);
        parse(str: string, value?: string | number | boolean | null): string | number | boolean | null;
        stringify(value: string | number | boolean | null): string;
        visible(value: string | number | boolean | null): boolean;
    }
    export class ArrayAttributeParser<T> implements AttributeParser<T[]> {
        private delimiter;
        private elementParser;
        constructor(elementParser?: AttributeParser<T> | {
            new (): AttributeParser<T>;
        }, delimiter?: string);
        parse(str: string, value?: T[]): T[];
        stringify(value: T[]): string;
        visible(value: T[]): boolean;
    }
    export class AutoAttributeParser implements AttributeParser<any> {
        private arrayAttributeParser;
        private primitiveAttributeParser;
        parse(str: string, value?: any): any;
        stringify(value: any): string;
        visible(value: any): boolean;
    }
    export function domAttr<T extends PIXI.DisplayObject, P>(parser?: AttributeParser<P> | {
        new (): AttributeParser<P>;
    }): (target: T, propertyName: string) => void;


    export function domLeaf<T extends PIXI.DisplayObject>(): (constructor: new (...args: any[]) => T) => void;


    export function domHidden<T extends PIXI.DisplayObject>(): (constructor: new (...args: any[]) => T) => void;
    export class PixiInspector {
        private _rootNode;
        private _canvas;
        private _rootElement;
        private readonly _elementPool;
        private readonly _tempRect;
        private readonly _mutationObserver;
        private _updateInterval;
        private _updateIntervalId;
        private _pointerEvents;
        private static styleSheet;
        constructor(_rootNode: PIXI.Container, _canvas: HTMLCanvasElement);
        domAttr<T extends PIXI.DisplayObject, P>(nodeType: {
            new (...args: any[]): T;
        }, propertyName: keyof T, parser?: AttributeParser<P> | {
            new (): AttributeParser<P>;
        }): this;
        domLeaf<T extends PIXI.DisplayObject>(nodeType: {
            new (...args: any[]): T;
        }): this;
        domHidden<T extends PIXI.DisplayObject>(nodeType: {
            new (...args: any[]): T;
        }): this;
        updateInterval: number;
        private startUpdateInterval;
        update(): void;
        private buildElement;
        private releaseElement;
        private setElementStyle;
        private setElementAttributes;
        private onDomChange;
        private createStyleSheet;
        private addDocumentListeners;
    }
    export class PointAttributeParser implements AttributeParser<{
        x: number;
        y: number;
    }> {
        private numberPrecision;
        private factory?;
        constructor(numberPrecision?: number, factory?: () => {
            x: number;
            y: number;
        });
        parse(str: string, value?: {
            x: number;
            y: number;
        }): {
            x: number;
            y: number;
        };
        stringify(value: {
            x: number;
            y: number;
        }): string;
        visible(value: {
            x: number;
            y: number;
        }): boolean;
    }
    export class TextureAttributeParser implements AttributeParser<PIXI.Texture> {
        parse(str: string, value?: PIXI.Texture): PIXI.Texture;
        stringify(value: PIXI.Texture): string;
        visible(value: PIXI.Texture): boolean;
    }
    export function getDefault(rootNode: PIXI.Container, canvas: HTMLCanvasElement): PixiInspector;
}
//# sourceMappingURL=pixi-inspector.d.ts.map