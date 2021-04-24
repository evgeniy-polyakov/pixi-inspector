declare module "inspect" {
    export function inspect(): void;
}
declare module "ContextMenu" {
    import * as PIXI from "pixi.js";
    export interface IContextMenuData {
        target: PIXI.DisplayObject;
        children: IContextMenuData[];
        texture?: PIXI.Texture;
    }
    export class ContextMenu {
        private readonly _data;
        private readonly _root;
        private readonly _renderer;
        private readonly _style;
        private _textureImage?;
        constructor(event: MouseEvent, renderer: PIXI.AbstractRenderer, data: IContextMenuData, style: string);
        destroy(): void;
        private dataToHtml;
        private getItemName;
        private getClassName;
        private getData;
        private inspectElement;
        private showTexturePopup;
        private hideTexturePopup;
    }
}
declare module "StyleSheet" {
    export const StyleSheet: string;
}
declare module "PixiInspector" {
    import * as PIXI from "pixi.js";
    export class PixiInspector {
        private readonly _root;
        private readonly _renderer;
        private readonly _interaction;
        private readonly _tempRect;
        private readonly _styleSheet;
        private readonly _style;
        private _enabled;
        private _contextMenu?;
        constructor(root: PIXI.Container, renderer: PIXI.AbstractRenderer, style?: "dark" | "light");
        get enabled(): boolean;
        set enabled(value: boolean);
        private disablePixiRightClick;
        private showContextMenu;
        private getStagePoint;
        private flattenDescendants;
        private getContextMenuData;
        private createStyleSheet;
        private detectStyle;
    }
}
