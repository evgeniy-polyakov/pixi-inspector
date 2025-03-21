import * as PIXI from "pixi.js";

export interface IContextMenuData {
    target: PIXI.Container;
    children: IContextMenuData[];
    texture?: PIXI.Texture;
}

export class ContextMenu {

    private readonly _data: IContextMenuData;
    private readonly _root: HTMLElement;
    private readonly _renderer: PIXI.Renderer;
    private readonly _style: string;
    private readonly _inspect = new Function("console.dir(this); debugger;");
    private _textureImage?: HTMLElement;

    constructor(event: MouseEvent, renderer: PIXI.Renderer, data: IContextMenuData, style: string) {

        const div = document.createElement("div");
        div.style.position = "fixed";
        div.className = "pixi-inspector-context-anchor";
        document.body.append(div);

        const ul = document.createElement("ul");
        ul.innerHTML = this.dataToHtml(data, "0", 0);
        ul.style.margin = "0";
        ul.className = `pixi-inspector-context-menu pixi-inspector-context-menu-${style}`;
        div.append(ul);

        const x = Math.max(0, Math.min(window.innerWidth - ul.clientWidth, event.clientX));
        const y = Math.max(0, Math.min(window.innerHeight - ul.clientHeight, event.clientY));
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;

        ul.querySelectorAll("li > label").forEach(it => {
            it.addEventListener("click", event => {
                event.stopPropagation();
                this.inspectElement(it.closest("li") as HTMLElement);
            });
        });
        ul.querySelectorAll("li > label > div.toggle").forEach(it => {
            it.addEventListener("click", event => {
                event.stopPropagation();
                (it.closest("li") as HTMLElement).classList.toggle("collapsed");
            });
        });
        ul.querySelectorAll("span[data-texture]").forEach(it => {
            it.addEventListener("mouseover", event => {
                this.showTexturePopup(it as HTMLElement);
            });
            it.addEventListener("mouseout", event => {
                this.hideTexturePopup();
            });
        });

        this._data = data;
        this._root = div;
        this._style = style;
        this._renderer = renderer;
    }

    destroy() {
        this._root.remove();
    }

    private dataToHtml(data: IContextMenuData, id: string, level: number): string {
        const startPadding = 0.8;
        const levelPadding = 1.4;
        const branchPadding = 0.5;
        const hasChildren = data.children.length > 0;
        return `<li data-id="${id}" data-visible="${this.getVisible(data.target)}">
<label style="padding-left:${(levelPadding * level + startPadding).toFixed(2)}em">
${hasChildren ? `<div style="width:${(levelPadding * level + startPadding).toFixed(2)}em" class="toggle"></div>` : ""}
${this.getItemName(data, id)}
</label>
${hasChildren ? `<ul>${data.children.map((it, i) => this.dataToHtml(it, `${id}-${i}`, level + 1)).join("")}</ul>` : ""}
<div style="left:${(levelPadding * level + branchPadding - startPadding).toFixed(2)}em" class="branch">
${hasChildren ? "<span class=\"toggle\"></span>" : ""}
</div>
</li>`;
    }

    private getVisible(target: PIXI.Container): boolean {
        if (!target.visible || target.alpha === 0) {
            return false;
        }
        if (target.parent) {
            return this.getVisible(target.parent);
        }
        return true;
    }

    private getItemName(data: IContextMenuData, id: string): string {
        let name = `<span>${this.getClassName(data.target)}</span>`;
        const texture = (data.target as {
            texture?: PIXI.Texture;
        }).texture;
        if (texture?.isTexture) {
            data.texture = texture;
            name += `<span>:&nbsp;</span><span data-texture="${id}"><u>${
                texture === PIXI.Texture.EMPTY ? "Texture.EMPTY" :
                    texture === PIXI.Texture.WHITE ? "Texture.WHITE" :
                        texture instanceof PIXI.RenderTexture ? "RenderTexture" :
                            texture.label ? texture.label : texture.uid
            }</u></span>`
        }
        return name;
    }

    private getClassName(obj: PIXI.Container): string {
        let className: string | undefined;
        if (obj.constructor) {
            if ((obj.constructor as any).name) {
                className = (obj.constructor as any).name;
            } else {
                const exec = /function\s+(\w+)\(/.exec(obj.constructor.toString());
                className = exec ? exec[1] : undefined;
            }
        }
        return className || "DisplayObject";
    }

    private getData(data: IContextMenuData, ids: number[]): IContextMenuData | undefined {
        if (!data) {
            return undefined;
        }
        ids.shift();
        if (ids.length === 0) {
            return data;
        }
        return this.getData(data.children[ids[0]], ids);
    }

    private inspectElement(li: HTMLElement) {
        const ids = li.dataset.id?.split("-").map(it => parseInt(it));
        if (ids) {
            const data = this.getData(this._data, ids);
            if (data) {
                this._inspect.call(data.target);
            }
        }
    }

    private showTexturePopup(span: HTMLElement) {
        this.hideTexturePopup();
        const ids = span.dataset.texture?.split("-").map(it => parseInt(it));
        if (!ids) {
            return;
        }
        const data = this.getData(this._data, ids);
        if (data?.texture) {
            const renderer = this._renderer;
            if (renderer && renderer.extract && typeof renderer.extract.image === "function") {

                const vw = 12;
                const size = window.innerWidth * vw / 100;
                const sprite = new PIXI.Sprite(data.texture);
                const scale = Math.min(1, size / sprite.width, size / sprite.height);
                sprite.scale.set(scale);
                const container = new PIXI.Container();
                container.addChild(sprite);

                const canvas = renderer.extract.canvas(container) as HTMLCanvasElement;
                const rootRect = this._root.getBoundingClientRect();
                const itemRect = span.parentElement!.getBoundingClientRect();
                this._root.append(canvas);
                canvas.className = `pixi-inspector-texture-popup pixi-inspector-texture-popup-${this._style}`;
                canvas.style.position = "absolute";
                if (data.texture.width > data.texture.height) {
                    canvas.style.maxWidth = `${vw}vw`;
                } else {
                    canvas.style.maxHeight = `${vw}vw`;
                }
                const top = Math.max(-rootRect.top, Math.min(itemRect.top - rootRect.top, window.innerHeight - canvas.clientHeight - rootRect.top));
                canvas.style.top = `${top}px`;
                const isLeft = rootRect.right + canvas.clientWidth > window.innerWidth;
                if (isLeft) {
                    canvas.style.right = "100%";
                } else {
                    canvas.style.left = "100%";
                }
                this._textureImage = canvas;
            }
        }
    }

    private hideTexturePopup() {
        if (this._textureImage) {
            this._textureImage.remove();
            this._textureImage = undefined;
        }
    }
}