import * as PIXI from "pixi.js";
export declare class PixiInspector {
    private readonly _root;
    private readonly _renderer;
    private readonly _interaction;
    private readonly _tempRect;
    private readonly _styleSheet;
    private readonly _style;
    private _enabled;
    private _contextMenu?;
    constructor(root: PIXI.Container, renderer: PIXI.Renderer, style?: "dark" | "light");
    get enabled(): boolean;
    set enabled(value: boolean);
    private disablePixiRightClick;
    private showContextMenu;
    private hideContextMenu;
    private getStagePoint;
    private flattenDescendants;
    private getContextMenuData;
    private createStyleSheet;
    private detectStyle;
}
