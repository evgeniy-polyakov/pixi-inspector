/*!
 * pixi-inspector - v1.0.7
 * Compiled Sat, 24 Apr 2021 22:01:16 UTC
 *
 * pixi-inspector is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pixiInspector = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenu = void 0;
var PIXI = require("pixi.js");
var inspect_1 = require("./inspect");
var ContextMenu = (function () {
    function ContextMenu(event, renderer, data, style) {
        var _this = this;
        var div = document.createElement("div");
        div.style.position = "fixed";
        div.className = "pixi-inspector-context-anchor";
        document.body.append(div);
        var ul = document.createElement("ul");
        ul.innerHTML = this.dataToHtml(data, "0", 0);
        ul.style.margin = "0";
        ul.className = "pixi-inspector-context-menu pixi-inspector-context-menu-" + style;
        div.append(ul);
        var x = Math.max(0, Math.min(window.innerWidth - ul.clientWidth, event.clientX));
        var y = Math.max(0, Math.min(window.innerHeight - ul.clientHeight, event.clientY));
        div.style.top = y + "px";
        div.style.left = x + "px";
        ul.querySelectorAll("li").forEach(function (li) {
            var _a;
            (_a = li.querySelector("label")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (event) {
                _this.inspectElement(li);
            });
            li.querySelectorAll("span[data-texture]").forEach(function (it) {
                it.addEventListener("mouseover", function (event) {
                    _this.showTexturePopup(it);
                });
                it.addEventListener("mouseout", function (event) {
                    _this.hideTexturePopup();
                });
            });
        });
        this._data = data;
        this._root = div;
        this._style = style;
        this._renderer = renderer;
    }
    ContextMenu.prototype.destroy = function () {
        this._root.remove();
    };
    ContextMenu.prototype.dataToHtml = function (data, id, level) {
        var _this = this;
        var startPadding = 0.8;
        var levelPadding = 1.4;
        var branchPadding = 0.5;
        return "<li data-id=\"" + id + "\" data-visible=\"" + (data.target.worldVisible && data.target.worldAlpha > 0) + "\">\n<label style=\"padding-left:" + (levelPadding * level + startPadding) + "em\">" + this.getItemName(data, id) + "</label>\n<ul>" + data.children.map(function (it, i) { return _this.dataToHtml(it, id + "-" + i, level + 1); }).join("") + "</ul>\n<div style=\"left:" + (levelPadding * level + branchPadding - startPadding) + "em\" class=\"branch\"></div>\n</li>";
    };
    ContextMenu.prototype.getItemName = function (data, id) {
        var name = "<span>" + this.getClassName(data.target) + "</span>";
        var texture = data.target.texture;
        if (texture instanceof PIXI.Texture) {
            data.texture = texture;
            name += "<span>:&nbsp;</span><span data-texture=\"" + id + "\">" + (texture === PIXI.Texture.EMPTY ? "<u>empty</u>" :
                texture === PIXI.Texture.WHITE ? "<u>white</u>" :
                    texture instanceof PIXI.RenderTexture ? "<u>rendered</u>" :
                        texture.textureCacheIds && texture.textureCacheIds.length > 0 ?
                            texture.textureCacheIds.slice(0, 2).map(function (it) { return "<u>" + it + "</u>"; }).join("<span>,&nbsp</span>") :
                            "<u>unnamed</u>") + "</span>";
        }
        return name;
    };
    ContextMenu.prototype.getClassName = function (obj) {
        var className;
        if (obj.constructor) {
            if (obj.constructor.name) {
                className = obj.constructor.name;
            }
            else {
                var exec = /function\s+(\w+)\(/.exec(obj.constructor.toString());
                className = exec ? exec[1] : undefined;
            }
        }
        return className || "DisplayObject";
    };
    ContextMenu.prototype.getData = function (data, ids) {
        if (!data) {
            return undefined;
        }
        ids.shift();
        if (ids.length === 0) {
            return data;
        }
        return this.getData(data.children[ids[0]], ids);
    };
    ContextMenu.prototype.inspectElement = function (li) {
        var _a;
        var ids = (_a = li.dataset.id) === null || _a === void 0 ? void 0 : _a.split("-").map(function (it) { return parseInt(it); });
        if (ids) {
            var data = this.getData(this._data, ids);
            if (data) {
                inspect_1.inspect.call(data.target);
            }
        }
    };
    ContextMenu.prototype.showTexturePopup = function (span) {
        var _a;
        this.hideTexturePopup();
        var ids = (_a = span.dataset.texture) === null || _a === void 0 ? void 0 : _a.split("-").map(function (it) { return parseInt(it); });
        if (!ids) {
            return;
        }
        var data = this.getData(this._data, ids);
        if (data === null || data === void 0 ? void 0 : data.texture) {
            var renderer = this._renderer;
            if (renderer && renderer.extract && typeof renderer.extract.image === "function") {
                var vw = 12;
                var size = window.innerWidth * vw / 100;
                var sprite = new PIXI.Sprite(data.texture);
                var scale = Math.min(1, size / sprite.width, size / sprite.height);
                sprite.scale.set(scale);
                var container = new PIXI.Container();
                container.addChild(sprite);
                var canvas = renderer.extract.canvas(container);
                var rootRect = this._root.getBoundingClientRect();
                var itemRect = span.parentElement.getBoundingClientRect();
                this._root.append(canvas);
                canvas.className = "pixi-inspector-texture-popup pixi-inspector-texture-popup-" + this._style;
                canvas.style.position = "absolute";
                if (data.texture.width > data.texture.height) {
                    canvas.style.maxWidth = vw + "vw";
                }
                else {
                    canvas.style.maxHeight = vw + "vw";
                }
                var top_1 = Math.max(-rootRect.top, Math.min(itemRect.top - rootRect.top, window.innerHeight - canvas.clientHeight - rootRect.top));
                canvas.style.top = top_1 + "px";
                var isLeft = rootRect.right + canvas.clientWidth > window.innerWidth;
                if (isLeft) {
                    canvas.style.right = "100%";
                }
                else {
                    canvas.style.left = "100%";
                }
                this._textureImage = canvas;
            }
        }
    };
    ContextMenu.prototype.hideTexturePopup = function () {
        if (this._textureImage) {
            this._textureImage.remove();
            this._textureImage = undefined;
        }
    };
    return ContextMenu;
}());
exports.ContextMenu = ContextMenu;

},{"./inspect":4,"pixi.js":undefined}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiInspector = void 0;
var PIXI = require("pixi.js");
var ContextMenu_1 = require("./ContextMenu");
var StyleSheet_1 = require("./StyleSheet");
var PixiInspector = (function () {
    function PixiInspector(root, renderer, style) {
        var _this = this;
        this._tempRect = new PIXI.Rectangle();
        this._enabled = false;
        this.disablePixiRightClick = function (event) {
            if (event.target === _this._renderer.view) {
                if (_this._contextMenu) {
                    _this._contextMenu.destroy();
                    _this._contextMenu = undefined;
                }
                if ((event instanceof PointerEvent ? event.pointerType === "mouse" : true) && event.button === 2) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
        this.showContextMenu = function (event) {
            if (event.target === _this._renderer.view) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                var point = _this.getStagePoint(event);
                var data = _this.getContextMenuData(point, _this._root);
                if (data) {
                    if (_this._contextMenu) {
                        _this._contextMenu.destroy();
                    }
                    _this._contextMenu = new ContextMenu_1.ContextMenu(event, _this._renderer, data, _this._style);
                }
            }
        };
        this._root = root;
        this._renderer = renderer;
        this._interaction = this._renderer.plugins.interaction;
        this._styleSheet = this.createStyleSheet();
        this._style = style || this.detectStyle();
        this.enabled = true;
    }
    Object.defineProperty(PixiInspector.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            if (this._enabled != value) {
                this._enabled = value;
                if (value) {
                    document.head.appendChild(this._styleSheet);
                    document.addEventListener("pointerdown", this.disablePixiRightClick, true);
                    document.addEventListener("mousedown", this.disablePixiRightClick, true);
                    document.addEventListener("contextmenu", this.showContextMenu, true);
                }
                else {
                    document.head.removeChild(this._styleSheet);
                    document.removeEventListener("pointerdown", this.disablePixiRightClick, true);
                    document.removeEventListener("mousedown", this.disablePixiRightClick, true);
                    document.removeEventListener("contextmenu", this.showContextMenu, true);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    PixiInspector.prototype.getStagePoint = function (event) {
        var point = { x: 0, y: 0 };
        this._interaction.mapPositionToPoint(point, event.clientX, event.clientY);
        return point;
    };
    PixiInspector.prototype.flattenDescendants = function (target, result) {
        if (target instanceof PIXI.Container && target.children.length > 0) {
            for (var _i = 0, _a = target.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.flattenDescendants(child, result);
            }
        }
        else {
            result.push(target);
        }
        return result;
    };
    PixiInspector.prototype.getContextMenuData = function (point, target) {
        var _this = this;
        var sprites = this.flattenDescendants(target, []).filter(function (it) {
            var rect = it.getBounds(false, _this._tempRect);
            return point.x >= rect.x && point.x <= rect.x + rect.width &&
                point.y >= rect.y && point.y <= rect.y + rect.height;
        });
        if (sprites.length > 0) {
            var nodes = [];
            var rootNode = void 0;
            var _loop_1 = function (sprite) {
                var node = { target: sprite, children: [] };
                var parent_1 = sprite.parent;
                while (parent_1) {
                    var parentNode = nodes.filter(function (it) { return it.target === parent_1; })[0];
                    if (parentNode) {
                        if (parentNode.children.indexOf(node) < 0) {
                            parentNode.children.push(node);
                        }
                    }
                    else {
                        parentNode = { target: parent_1, children: [node] };
                        nodes.push(parentNode);
                    }
                    if (parent_1 === target) {
                        rootNode = parentNode;
                    }
                    node = parentNode;
                    parent_1 = parent_1.parent;
                }
            };
            for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
                var sprite = sprites_1[_i];
                _loop_1(sprite);
            }
            return rootNode;
        }
        return undefined;
    };
    PixiInspector.prototype.createStyleSheet = function () {
        var element = document.createElement("style");
        element.innerText = StyleSheet_1.StyleSheet;
        return element;
    };
    PixiInspector.prototype.detectStyle = function () {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    return PixiInspector;
}());
exports.PixiInspector = PixiInspector;

},{"./ContextMenu":1,"./StyleSheet":3,"pixi.js":undefined}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleSheet = void 0;
exports.StyleSheet = "\n    .pixi-inspector-context-menu,\n    .pixi-inspector-context-menu ul {\n        list-style: none;\n        margin: 0;\n        padding: 0;\n    }\n\n    .pixi-inspector-texture-popup,\n    .pixi-inspector-context-menu {\n        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n        font-size: 12px;\n        color: #202124;\n        background: #fff;\n        border: 1px solid #dadce0;\n        box-shadow: 4px 4px 3px -1px rgba(0, 0, 0, 0.5);\n        line-height: 1.2;\n        max-height: 100vh;\n        max-width: 100vw;\n        overflow: auto;\n    }\n\n    .pixi-inspector-context-menu > li:first-child {\n        padding-top: 0.25em;\n    }\n\n    .pixi-inspector-context-menu > li:last-child {\n        padding-bottom: 0.25em;\n    }\n\n    .pixi-inspector-context-menu ul li {\n        padding: 0;\n        position: relative;\n    }\n\n    .pixi-inspector-context-menu li label {\n        display: block;\n        padding: 0 1.4em;\n        white-space: nowrap;\n        cursor: pointer;\n    }\n\n    .pixi-inspector-context-menu li label span {\n        padding: 0.3em 0;\n        display: inline-block;\n    }\n\n    .pixi-inspector-context-menu li label:hover {\n        background: #c8c8c9;\n    }\n\n    .pixi-inspector-context-menu ul > li > .branch {\n        position: absolute;\n        top: 0;\n        left: 0;\n        height: 100%;\n        width: 0.8em;\n        border-left: #72777c 1px dotted;\n        pointer-events: none;\n    }\n\n    .pixi-inspector-context-menu ul > li > .branch:before {\n        content: '';\n        position: absolute;\n        top: 0.9em;\n        left: 0;\n        width: 100%;\n        border-top: #72777c 1px dotted;\n    }\n\n    .pixi-inspector-context-menu ul > li:last-child > .branch {\n        height: 0.8em;\n    }\n\n    .pixi-inspector-context-menu li[data-visible=false] {\n        color: #72777c;\n    }\n\n    .pixi-inspector-context-menu span[data-texture] u {\n        text-decoration: underline;\n    }\n\n    .pixi-inspector-texture-popup {\n        min-width: 72px;\n        object-fit: contain;\n        object-position: center;\n        pointer-events: none;\n        background-image: url(\"data:image/svg+xml;utf8," + encodeURIComponent('<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect height="12" width="12" y="0" x="12" fill="#dadce0"/><rect height="12" width="12" y="12" x="0" fill="#dadce0"/></svg>') + "\");\n    }\n\n    .pixi-inspector-texture-popup-dark {\n        background-image: url(\"data:image/svg+xml;utf8," + encodeURIComponent('<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect height="12" width="12" y="0" x="12" fill="#3c4043"/><rect height="12" width="12" y="12" x="0" fill="#3c4043"/></svg>') + "\");\n    }\n\n    .pixi-inspector-context-menu-dark,\n    .pixi-inspector-texture-popup-dark {\n        color: #e8eaed;\n        background-color: #292a2d;\n        border-color: #3c4043;\n    }\n\n    .pixi-inspector-context-menu-dark li label:hover {\n        background-color: #4b4c4f;\n    }\n\n    .pixi-inspector-context-menu-dark ul > li > .branch,\n    .pixi-inspector-context-menu-dark ul > li > .branch:before {\n        border-color: #8b9196;\n    }\n\n    .pixi-inspector-context-menu-dark li[data-visible=false] {\n        color: #8b9196;\n    }\n";

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspect = void 0;
function inspect() {
    debugger;
}
exports.inspect = inspect;

},{}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./PixiInspector"), exports);

},{"./PixiInspector":2}]},{},[5])(5)
});


//# sourceMappingURL=pixi-inspector.js.map
