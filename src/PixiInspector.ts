import * as PIXI from "pixi.js";
import {ContextMenu, IContextMenuData} from "./ContextMenu";
import {StyleSheet} from "./StyleSheet";

export class PixiInspector {

    private readonly _root: PIXI.Container;
    private readonly _renderer: PIXI.Renderer;
    private readonly _interaction: PIXI.EventSystem;
    private readonly _tempRect = new PIXI.Rectangle();
    private readonly _styleSheet: HTMLStyleElement;
    private readonly _style: string;
    private _enabled = false;
    private _contextMenu?: ContextMenu;

    constructor(root: PIXI.Container,
                renderer: PIXI.Renderer,
                style?: "dark" | "light") {
        this._root = root;
        this._renderer = renderer;
        this._interaction = this._renderer.events;
        this._styleSheet = this.createStyleSheet();
        this._style = style || this.detectStyle();
        this.enabled = true;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        if (this._enabled !== value) {
            this._enabled = value;
            if (value) {
                document.head.appendChild(this._styleSheet);
                document.addEventListener("pointerdown", this.disablePixiRightClick, true);
                document.addEventListener("mousedown", this.disablePixiRightClick, true);
                document.addEventListener("contextmenu", this.showContextMenu, true);
            } else {
                this.hideContextMenu();
                document.head.removeChild(this._styleSheet);
                document.removeEventListener("pointerdown", this.disablePixiRightClick, true);
                document.removeEventListener("mousedown", this.disablePixiRightClick, true);
                document.removeEventListener("contextmenu", this.showContextMenu, true);
            }
        }
    }

    private disablePixiRightClick = (event: PointerEvent | MouseEvent) => {
        if (event.target === this._renderer.view) {
            this.hideContextMenu();
            if ((event instanceof PointerEvent ? event.pointerType === "mouse" : true) && event.button === 2) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    private showContextMenu = (event: MouseEvent) => {
        if (event.target === this._renderer.view) {
            const point = this.getStagePoint(event);
            const data = this.getContextMenuData(point, this._root);
            if (data) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                this.hideContextMenu();
                this._contextMenu = new ContextMenu(event, this._renderer, data, this._style);
            }
        }
    }

    private hideContextMenu() {
        if (this._contextMenu) {
            this._contextMenu.destroy();
            this._contextMenu = undefined;
        }
    }

    private getStagePoint(event: MouseEvent) {
        const point = {x: 0, y: 0};
        this._interaction.mapPositionToPoint(point, event.clientX, event.clientY);
        return point;
    }

    private flattenDescendants(target: PIXI.DisplayObject, result: PIXI.DisplayObject[]) {
        if (target instanceof PIXI.Container && target.children.length > 0) {
            for (const child of target.children) {
                this.flattenDescendants(child, result);
            }
        } else {
            result.push(target);
        }
        return result;
    }

    private getContextMenuData(point: PIXI.IPointData, target: PIXI.DisplayObject): IContextMenuData | undefined {
        const sprites = this.flattenDescendants(target, []).filter(it => {
            const rect = it.getBounds(false, this._tempRect);
            return point.x >= rect.x && point.x <= rect.x + rect.width &&
                point.y >= rect.y && point.y <= rect.y + rect.height;
        });
        if (sprites.length > 0) {
            const nodes: IContextMenuData[] = [];
            let rootNode: IContextMenuData | undefined;
            for (const sprite of sprites) {
                let node = {target: sprite, children: []} as IContextMenuData;
                let parent = sprite.parent;
                while (parent) {
                    let parentNode = nodes.filter(it => it.target === parent)[0];
                    if (parentNode) {
                        if (parentNode.children.indexOf(node) < 0) {
                            parentNode.children.push(node);
                        }
                    } else {
                        parentNode = {target: parent, children: [node]};
                        nodes.push(parentNode);
                    }
                    if (parent === target) {
                        rootNode = parentNode;
                    }
                    node = parentNode;
                    parent = parent.parent;
                }
            }
            return rootNode;
        }
        return undefined;
    }

    private createStyleSheet() {
        const element = document.createElement("style");
        element.innerText = StyleSheet;
        return element;
    }

    private detectStyle() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
}