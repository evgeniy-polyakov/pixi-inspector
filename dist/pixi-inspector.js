(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('pixi.js')):typeof define==='function'&&define.amd?define(['exports','pixi.js'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g["pixi-inspector"]={},g.PIXI));})(this,(function(exports,PIXI){'use strict';function _interopNamespaceDefault(e){var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var PIXI__namespace=/*#__PURE__*/_interopNamespaceDefault(PIXI);class ContextMenu {
    constructor(event, renderer, data, style) {
        this._inspect = new Function("console.dir(this); debugger;");
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
                this.inspectElement(it.closest("li"));
            });
        });
        ul.querySelectorAll("li > label > div.toggle").forEach(it => {
            it.addEventListener("click", event => {
                event.stopPropagation();
                it.closest("li").classList.toggle("collapsed");
            });
        });
        ul.querySelectorAll("span[data-texture]").forEach(it => {
            it.addEventListener("mouseover", event => {
                this.showTexturePopup(it);
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
    dataToHtml(data, id, level) {
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
    getVisible(target) {
        if (!target.visible || target.alpha === 0) {
            return false;
        }
        if (target.parent) {
            return this.getVisible(target.parent);
        }
        return true;
    }
    getItemName(data, id) {
        let name = `<span>${this.getClassName(data.target)}</span>`;
        const texture = data.target.texture;
        if (texture === null || texture === void 0 ? void 0 : texture.isTexture) {
            data.texture = texture;
            name += `<span>:&nbsp;</span><span data-texture="${id}"><u>${texture === PIXI__namespace.Texture.EMPTY ? "Texture.EMPTY" :
                texture === PIXI__namespace.Texture.WHITE ? "Texture.WHITE" :
                    texture instanceof PIXI__namespace.RenderTexture ? "RenderTexture" :
                        texture.label ? texture.label : texture.uid}</u></span>`;
        }
        return name;
    }
    getClassName(obj) {
        let className;
        if (obj.constructor) {
            if (obj.constructor.name) {
                className = obj.constructor.name;
            }
            else {
                const exec = /function\s+(\w+)\(/.exec(obj.constructor.toString());
                className = exec ? exec[1] : undefined;
            }
        }
        return className || "DisplayObject";
    }
    getData(data, ids) {
        if (!data) {
            return undefined;
        }
        ids.shift();
        if (ids.length === 0) {
            return data;
        }
        return this.getData(data.children[ids[0]], ids);
    }
    inspectElement(li) {
        var _a;
        const ids = (_a = li.dataset.id) === null || _a === void 0 ? void 0 : _a.split("-").map(it => parseInt(it));
        if (ids) {
            const data = this.getData(this._data, ids);
            if (data) {
                this._inspect.call(data.target);
            }
        }
    }
    showTexturePopup(span) {
        var _a;
        this.hideTexturePopup();
        const ids = (_a = span.dataset.texture) === null || _a === void 0 ? void 0 : _a.split("-").map(it => parseInt(it));
        if (!ids) {
            return;
        }
        const data = this.getData(this._data, ids);
        if (data === null || data === void 0 ? void 0 : data.texture) {
            const renderer = this._renderer;
            if (renderer && renderer.extract && typeof renderer.extract.image === "function") {
                const vw = 12;
                const size = window.innerWidth * vw / 100;
                const sprite = new PIXI__namespace.Sprite(data.texture);
                const scale = Math.min(1, size / sprite.width, size / sprite.height);
                sprite.scale.set(scale);
                const container = new PIXI__namespace.Container();
                container.addChild(sprite);
                const canvas = renderer.extract.canvas(container);
                const rootRect = this._root.getBoundingClientRect();
                const itemRect = span.parentElement.getBoundingClientRect();
                this._root.append(canvas);
                canvas.className = `pixi-inspector-texture-popup pixi-inspector-texture-popup-${this._style}`;
                canvas.style.position = "absolute";
                if (data.texture.width > data.texture.height) {
                    canvas.style.maxWidth = `${vw}vw`;
                }
                else {
                    canvas.style.maxHeight = `${vw}vw`;
                }
                const top = Math.max(-rootRect.top, Math.min(itemRect.top - rootRect.top, window.innerHeight - canvas.clientHeight - rootRect.top));
                canvas.style.top = `${top}px`;
                const isLeft = rootRect.right + canvas.clientWidth > window.innerWidth;
                if (isLeft) {
                    canvas.style.right = "100%";
                }
                else {
                    canvas.style.left = "100%";
                }
                this._textureImage = canvas;
            }
        }
    }
    hideTexturePopup() {
        if (this._textureImage) {
            this._textureImage.remove();
            this._textureImage = undefined;
        }
    }
}const textColorLight = "#202124";
const textColorDark = "#e8eaed";
const bgColorLight = "#fff";
const bgColorDark = "#292a2d";
const borderColorLight = "#dadce0";
const borderColorDark = "#3c4043";
const hoverColorLight = "#c8c8c9";
const hoverColorDark = "#4b4c4f";
const branchColorLight = "#72777c";
const branchColorDark = "#8b9196";
// language=CSS
const StyleSheet = `
    .pixi-inspector-context-menu,
    .pixi-inspector-context-menu ul {
        list-style: none;
        margin: 0;
        padding: 0;
        user-select: none;
    }

    .pixi-inspector-texture-popup,
    .pixi-inspector-context-menu {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
        color: ${textColorLight};
        background: ${bgColorLight};
        border: 1px solid ${borderColorLight};
        box-shadow: 4px 4px 3px -1px rgba(0, 0, 0, 0.5);
        line-height: 1.2;
        max-height: 100vh;
        max-width: 100vw;
        overflow: auto;
    }

    .pixi-inspector-context-menu > li:first-child {
        padding-top: 0.25em;
    }

    .pixi-inspector-context-menu > li:last-child {
        padding-bottom: 0.25em;
    }

    .pixi-inspector-context-menu ul li {
        padding: 0;
        position: relative;
    }

    .pixi-inspector-context-menu li label {
        display: block;
        padding: 0 1.4em;
        white-space: nowrap;
        cursor: pointer;
        position: relative;
    }

    .pixi-inspector-context-menu li label > span {
        padding: 0.3em 0;
        display: inline-block;
    }

    .pixi-inspector-context-menu li label:hover {
        background: ${hoverColorLight};
    }

    .pixi-inspector-context-menu li > label > div.toggle {
        position: absolute;
        height: 100%;
        top: 0;
        left: 0;
    }

    .pixi-inspector-context-menu ul > li > .branch {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0.8em;
        border-left: ${branchColorLight} 1px dotted;
        pointer-events: none;
    }

    .pixi-inspector-context-menu ul > li > .branch:before {
        content: '';
        position: absolute;
        top: 0.9em;
        left: 0;
        width: 100%;
        border-top: ${branchColorLight} 1px dotted;
    }

    .pixi-inspector-context-menu ul > li:last-child > .branch {
        height: 0.8em;
    }

    .pixi-inspector-context-menu ul > li > .branch > .toggle {
        position: absolute;
        left: -5px;
        top: 7px;
        height: 7px;
        width: 7px;
        border: ${branchColorLight} 1px solid;
        background: ${bgColorLight};
    }

    .pixi-inspector-context-menu ul > li > .branch > .toggle:before,
    .pixi-inspector-context-menu ul > li > .branch > .toggle:after {
        content: '';
        display: block;
        position: absolute;
        background: ${branchColorLight};
    }

    .pixi-inspector-context-menu ul > li > .branch > .toggle:before {
        left: 1px;
        top: 3px;
        width: 5px;
        height: 1px;
    }

    .pixi-inspector-context-menu ul > li > .branch > .toggle:after {
        left: 3px;
        top: 1px;
        width: 1px;
        height: 5px;
        display: none;
    }

    .pixi-inspector-context-menu ul > li.collapsed > .branch > .toggle:after {
        display: block;
    }

    .pixi-inspector-context-menu ul > li.collapsed > ul {
        height: 0;
        overflow: hidden;
    }

    .pixi-inspector-context-menu li[data-visible=false] {
        color: ${branchColorLight};
    }

    .pixi-inspector-context-menu span[data-texture] u {
        text-decoration: underline;
    }

    .pixi-inspector-texture-popup {
        min-width: 72px;
        object-fit: contain;
        object-position: center;
        pointer-events: none;
        background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect height="12" width="12" y="0" x="12" fill="${borderColorLight}"/><rect height="12" width="12" y="12" x="0" fill="${borderColorLight}"/></svg>`)}");
    }

    .pixi-inspector-texture-popup-dark {
        background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect height="12" width="12" y="0" x="12" fill="${borderColorDark}"/><rect height="12" width="12" y="12" x="0" fill="${borderColorDark}"/></svg>`)}");
    }

    .pixi-inspector-context-menu-dark,
    .pixi-inspector-texture-popup-dark {
        color: ${textColorDark};
        background-color: ${bgColorDark};
        border-color: ${borderColorDark};
    }

    .pixi-inspector-context-menu-dark li label:hover {
        background-color: ${hoverColorDark};
    }

    .pixi-inspector-context-menu-dark ul > li > .branch,
    .pixi-inspector-context-menu-dark ul > li > .branch:before {
        border-color: ${branchColorDark};
    }

    .pixi-inspector-context-menu-dark li[data-visible=false] {
        color: ${branchColorDark};
    }

    .pixi-inspector-context-menu-dark ul > li > .branch > .toggle {
        background: ${bgColorDark};
    }

    .pixi-inspector-context-menu ul > li > .branch > .toggle:before,
    .pixi-inspector-context-menu ul > li > .branch > .toggle:after {
        background: ${branchColorDark};
    }
`;class PixiInspector {
    constructor(root, renderer, style) {
        this._tempRect = new PIXI__namespace.Bounds();
        this._enabled = false;
        this.disablePixiRightClick = (event) => {
            if (event.target === this._renderer.canvas) {
                this.hideContextMenu();
                if ((event instanceof PointerEvent ? event.pointerType === "mouse" : true) && event.button === 2) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
        this.showContextMenu = (event) => {
            if (event.target === this._renderer.canvas) {
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
        };
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
            }
            else {
                this.hideContextMenu();
                document.head.removeChild(this._styleSheet);
                document.removeEventListener("pointerdown", this.disablePixiRightClick, true);
                document.removeEventListener("mousedown", this.disablePixiRightClick, true);
                document.removeEventListener("contextmenu", this.showContextMenu, true);
            }
        }
    }
    hideContextMenu() {
        if (this._contextMenu) {
            this._contextMenu.destroy();
            this._contextMenu = undefined;
        }
    }
    getStagePoint(event) {
        const point = { x: 0, y: 0 };
        this._interaction.mapPositionToPoint(point, event.clientX, event.clientY);
        return point;
    }
    flattenDescendants(target, result) {
        if (target instanceof PIXI__namespace.Container && target.children.length > 0) {
            for (const child of target.children) {
                this.flattenDescendants(child, result);
            }
        }
        else {
            result.push(target);
        }
        return result;
    }
    getContextMenuData(point, target) {
        const sprites = this.flattenDescendants(target, []).filter(it => {
            const rect = it.getBounds(false, this._tempRect);
            return point.x >= rect.x && point.x <= rect.x + rect.width &&
                point.y >= rect.y && point.y <= rect.y + rect.height;
        });
        if (sprites.length > 0) {
            const nodes = [];
            let rootNode;
            for (const sprite of sprites) {
                let node = { target: sprite, children: [] };
                let parent = sprite.parent;
                while (parent) {
                    let parentNode = nodes.filter(it => it.target === parent)[0];
                    if (parentNode) {
                        if (parentNode.children.indexOf(node) < 0) {
                            parentNode.children.push(node);
                        }
                    }
                    else {
                        parentNode = { target: parent, children: [node] };
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
    createStyleSheet() {
        const element = document.createElement("style");
        element.innerText = StyleSheet;
        return element;
    }
    detectStyle() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
}exports.PixiInspector=PixiInspector;}));