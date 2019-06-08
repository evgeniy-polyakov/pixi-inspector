/*!
 * pixi-inspector - v1.0.7
 * Compiled Sat, 08 Jun 2019 19:37:45 UTC
 *
 * pixi-inspector is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pixiInspector = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domAttr_1 = require("./decorators/domAttr");
var domLeaf_1 = require("./decorators/domLeaf");
var domHidden_1 = require("./decorators/domHidden");
var PixiInspector = (function () {
    function PixiInspector(_rootNode, _canvas) {
        var _this = this;
        this._rootNode = _rootNode;
        this._canvas = _canvas;
        this._elementPool = new ElementPool();
        this._tempRect = new PIXI.Rectangle();
        this._mutationObserver = new MutationObserver(function (mutations) { return _this.onDomChange(mutations); });
        this._updateInterval = 0.2;
        this.createStyleSheet();
        this.update();
        _canvas.parentNode.insertBefore(this._rootElement, _canvas.nextSibling);
        this.addDocumentListeners();
        this.startUpdateInterval();
    }
    PixiInspector.prototype.domAttr = function (nodeType, propertyName, parser) {
        domAttr_1.domAttr(parser)(nodeType.prototype, propertyName);
        return this;
    };
    PixiInspector.prototype.domLeaf = function (nodeType) {
        domLeaf_1.domLeaf()(nodeType);
        return this;
    };
    PixiInspector.prototype.domHidden = function (nodeType) {
        domHidden_1.domHidden()(nodeType);
        return this;
    };
    Object.defineProperty(PixiInspector.prototype, "updateInterval", {
        get: function () {
            return this._updateInterval;
        },
        set: function (value) {
            if (this._updateInterval != value) {
                this._updateInterval = value;
                this.startUpdateInterval();
            }
        },
        enumerable: true,
        configurable: true
    });
    PixiInspector.prototype.startUpdateInterval = function () {
        var _this = this;
        clearInterval(this._updateIntervalId);
        this._updateIntervalId = setInterval(function () { return _this.update(); }, this._updateInterval * 1000);
    };
    PixiInspector.prototype.update = function () {
        PixiInspector.styleSheet.disabled = true;
        this._mutationObserver.disconnect();
        this._rootElement = this.buildElement(this._rootNode, this._rootElement);
        this._mutationObserver.observe(this._rootElement, { subtree: true, attributes: true });
        PixiInspector.styleSheet.disabled = false;
    };
    PixiInspector.prototype.buildElement = function (node, element) {
        element = element || this._elementPool.get(node);
        element.pixiTarget = node;
        this.setElementStyle(node, element);
        this.setElementAttributes(node, element);
        if (node instanceof PIXI.Container && !node['__pixi_inspector_is_leaf__']) {
            var i = 0;
            var n = Math.min(node.children.length, element.childNodes.length);
            for (; i < n; i++) {
                var childElement = element.childNodes[i];
                var childNode = node.children[i];
                if (childElement.pixiTarget == childNode) {
                    this.buildElement(childNode, childElement);
                }
                else {
                    element.replaceChild(this.buildElement(childNode), childElement);
                    this.releaseElement(childElement);
                }
            }
            while (element.childNodes.length > n) {
                this.releaseElement(element.lastChild);
                element.lastChild.remove();
            }
            n = node.children.length;
            for (; i < n; i++) {
                element.appendChild(this.buildElement(node.children[i]));
            }
        }
        return element;
    };
    PixiInspector.prototype.releaseElement = function (element) {
        element.pixiTarget = null;
        while (element.attributes.length > 1) {
            element.removeAttributeNode(element.attributes[1]);
        }
        while (element.childNodes.length > 0) {
            this.releaseElement(element.lastChild);
            element.lastChild.remove();
        }
        this._elementPool.release(element);
    };
    PixiInspector.prototype.setElementStyle = function (node, element) {
        var bounds = node.getBounds(false, this._tempRect);
        if (!element.pixiStyle) {
            var index = PixiInspector.styleSheet.cssRules.length;
            PixiInspector.styleSheet.insertRule("#px" + index + " {position:fixed;top:0;left:0;width:0;height:0}", index);
            element.pixiStyle = PixiInspector.styleSheet.cssRules[index].style;
            element.id = "px" + index;
        }
        var style = element.pixiStyle;
        if (node['__pixi_inspector_is_hidden__']) {
            style.display = 'none';
        }
        style.top = (bounds.top + this._canvas.offsetTop).toFixed(2) + "px";
        style.left = (bounds.left + this._canvas.offsetLeft).toFixed(2) + "px";
        style.width = (bounds.width).toFixed(2) + "px";
        style.height = (bounds.height).toFixed(2) + "px";
    };
    PixiInspector.prototype.setElementAttributes = function (node, element) {
        var attributes = node['__pixi_inspector_attributes__'];
        if (attributes) {
            for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                var attribute = attributes_1[_i];
                var value = void 0;
                try {
                    value = node[attribute.name];
                }
                catch (e) {
                    continue;
                }
                if (attribute.parser.visible(value)) {
                    element.setAttribute(attribute.name, attribute.parser.stringify(value));
                }
            }
        }
    };
    PixiInspector.prototype.onDomChange = function (mutations) {
        for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
            var mutation = mutations_1[_i];
            if (mutation.type == 'attributes') {
                var element = mutation.target;
                var node = element.pixiTarget;
                if (node) {
                    var value = element.getAttribute(mutation.attributeName);
                    var name_1 = mutation.attributeName.toLowerCase();
                    var attributes = node['__pixi_inspector_attributes__'];
                    if (attributes) {
                        for (var _a = 0, attributes_2 = attributes; _a < attributes_2.length; _a++) {
                            var attribute = attributes_2[_a];
                            if (attribute.name.toLowerCase() == name_1) {
                                node[attribute.name] = attribute.parser.parse(value, node[attribute.name]);
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    PixiInspector.prototype.createStyleSheet = function () {
        if (!PixiInspector.styleSheet) {
            var style = document.createElement('style');
            style.appendChild(document.createTextNode('' +
                '[id^="px"] {pointer-events:none;}' +
                '[id^="px"]:empty {pointer-events:none;}' +
                '[id^="px"]:empty:hover {background:rgba(255,255,255,0.2);border:solid 1px #fff}'));
            document.head.appendChild(style);
            PixiInspector.styleSheet = style.sheet;
        }
    };
    PixiInspector.prototype.addDocumentListeners = function () {
        var _this = this;
        var ctrl = 17;
        var style = PixiInspector.styleSheet.cssRules[1].style;
        document.addEventListener('keydown', function (event) {
            if (event.which == ctrl && !_this._pointerEvents) {
                _this._pointerEvents = true;
                style.pointerEvents = 'auto';
            }
        });
        document.addEventListener('keyup', function (event) {
            if (event.which == ctrl && _this._pointerEvents) {
                _this._pointerEvents = false;
                style.pointerEvents = 'none';
            }
        });
        document.addEventListener('click', function (event) {
            var target = event.target.pixiTarget;
            if (target) {
                window.$pixi = target;
            }
        });
        document.addEventListener('contextmenu', function (event) {
            var target = event.target.pixiTarget;
            if (target) {
                window.$pixi = target;
            }
        });
    };
    return PixiInspector;
}());
exports.PixiInspector = PixiInspector;
var ElementPool = (function () {
    function ElementPool() {
        this.pools = {};
    }
    ElementPool.prototype.get = function (obj) {
        var tagName = 'px-' + this.getTagName(obj).toLowerCase();
        if (!Array.isArray(this.pools[tagName])) {
            this.pools[tagName] = [];
            if (!customElements.get(tagName)) {
                customElements.define(tagName, function () {
                }, { extends: 'div' });
            }
        }
        return this.pools[tagName].pop() || document.createElement(tagName);
    };
    ElementPool.prototype.release = function (element) {
        if (this.pools[element.localName].indexOf(element) < 0) {
            this.pools[element.localName].push(element);
        }
    };
    ElementPool.prototype.getTagName = function (obj) {
        var className = null;
        if (obj.constructor) {
            var exec = /function\s+(\w{2,})\(/.exec(obj.constructor.toString());
            className = exec ? exec[1] : null;
        }
        if (className) {
            return className;
        }
        for (var _i = 0, _a = ElementPool.defaultConstructors; _i < _a.length; _i++) {
            var defaultConstructor = _a[_i];
            if (obj instanceof defaultConstructor[0]) {
                return defaultConstructor[1];
            }
        }
        return 'DisplayObject';
    };
    ElementPool.defaultConstructors = [
        [PIXI.mesh.NineSlicePlane, 'NineSlicePlane'],
        [PIXI.mesh.Plane, 'Plane'],
        [PIXI.mesh.Rope, 'Rope'],
        [PIXI.Text, 'Text'],
        [PIXI.extras.BitmapText, 'BitmapText'],
        [PIXI.extras.AnimatedSprite, 'AnimatedSprite'],
        [PIXI.extras.TilingSprite, 'TilingSprite'],
        [PIXI.Sprite, 'Sprite'],
        [PIXI.Graphics, 'Graphics'],
        [PIXI.Container, 'Container'],
    ];
    return ElementPool;
}());

},{"./decorators/domAttr":8,"./decorators/domHidden":9,"./decorators/domLeaf":10}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrimitiveAttributeParser_1 = require("./PrimitiveAttributeParser");
var ArrayAttributeParser = (function () {
    function ArrayAttributeParser(elementParser, delimiter) {
        if (delimiter === void 0) { delimiter = ','; }
        this.delimiter = delimiter;
        this.elementParser = typeof elementParser == 'function'
            ? new elementParser()
            : (elementParser || (new PrimitiveAttributeParser_1.PrimitiveAttributeParser()));
    }
    ArrayAttributeParser.prototype.parse = function (str, value) {
        if (!Array.isArray(value)) {
            value = [];
        }
        var i = 0;
        var a = str.split(this.delimiter);
        var n = Math.min(value.length, a.length);
        for (i; i < n; i++) {
            value[i] = this.elementParser.parse(a[i], value[i]);
        }
        n = a.length;
        for (i; i < n; i++) {
            value[i] = this.elementParser.parse(a[i]);
        }
        while (value.length > n) {
            value.pop();
        }
        return value;
    };
    ArrayAttributeParser.prototype.stringify = function (value) {
        var _this = this;
        if (Array.isArray(value)) {
            return value.map(function (it) { return _this.elementParser.stringify(it); }).join(this.delimiter);
        }
        return '';
    };
    ArrayAttributeParser.prototype.visible = function (value) {
        return Array.isArray(value);
    };
    return ArrayAttributeParser;
}());
exports.ArrayAttributeParser = ArrayAttributeParser;

},{"./PrimitiveAttributeParser":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrimitiveAttributeParser_1 = require("./PrimitiveAttributeParser");
var ArrayAttributeParser_1 = require("./ArrayAttributeParser");
var AutoAttributeParser = (function () {
    function AutoAttributeParser() {
        this.arrayAttributeParser = new ArrayAttributeParser_1.ArrayAttributeParser();
        this.primitiveAttributeParser = new PrimitiveAttributeParser_1.PrimitiveAttributeParser();
    }
    AutoAttributeParser.prototype.parse = function (str, value) {
        if (Array.isArray(value)) {
            return this.arrayAttributeParser.parse(str, value);
        }
        return this.primitiveAttributeParser.parse(str, value);
    };
    AutoAttributeParser.prototype.stringify = function (value) {
        if (Array.isArray(value)) {
            return this.arrayAttributeParser.stringify(value);
        }
        return this.primitiveAttributeParser.stringify(value);
    };
    AutoAttributeParser.prototype.visible = function (value) {
        return true;
    };
    return AutoAttributeParser;
}());
exports.AutoAttributeParser = AutoAttributeParser;

},{"./ArrayAttributeParser":2,"./PrimitiveAttributeParser":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColorAttributeParser = (function () {
    function ColorAttributeParser() {
    }
    ColorAttributeParser.prototype.parse = function (str, value) {
        return parseInt(str.replace('#', '0x'));
    };
    ColorAttributeParser.prototype.stringify = function (value) {
        if (!value) {
            return '#000000';
        }
        return '#' + value.toString(16).replace('0x', '');
    };
    ColorAttributeParser.prototype.visible = function (value) {
        return true;
    };
    return ColorAttributeParser;
}());
exports.ColorAttributeParser = ColorAttributeParser;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PointAttributeParser = (function () {
    function PointAttributeParser(numberPrecision, factory) {
        if (numberPrecision === void 0) { numberPrecision = 2; }
        this.numberPrecision = numberPrecision;
        this.factory = factory;
    }
    PointAttributeParser.prototype.parse = function (str, value) {
        if (!value) {
            if (this.factory) {
                value = this.factory();
            }
            else {
                console.error('Cannot parse attribute from "' + str + '" because factory is not defined.');
                return value;
            }
        }
        var n = str.split(',');
        if (n.length > 1) {
            value.x = parseFloat(n[0]);
            value.y = parseFloat(n[1]);
        }
        else {
            value.x = value.y = parseFloat(n[0]);
        }
        return value;
    };
    PointAttributeParser.prototype.stringify = function (value) {
        if (value) {
            var x = Number(value.x || 0).toFixed(this.numberPrecision);
            var y = Number(value.y || 0).toFixed(this.numberPrecision);
            return x == y ? x : x + ',' + y;
        }
        return '';
    };
    PointAttributeParser.prototype.visible = function (value) {
        return value != null && !isNaN(value.x) && !isNaN(value.y);
    };
    return PointAttributeParser;
}());
exports.PointAttributeParser = PointAttributeParser;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrimitiveAttributeParser = (function () {
    function PrimitiveAttributeParser(numberPrecision) {
        if (numberPrecision === void 0) { numberPrecision = 2; }
        this.numberPrecision = numberPrecision;
    }
    PrimitiveAttributeParser.prototype.parse = function (str, value) {
        switch (typeof value) {
            case 'number':
                return parseFloat(str);
            case 'boolean':
                return str == 'true';
            case 'string':
                return str;
        }
        if (str == 'true' || str == 'false') {
            return str == 'true';
        }
        var n = parseFloat(str);
        if (!isNaN(n)) {
            return n;
        }
        return str;
    };
    PrimitiveAttributeParser.prototype.stringify = function (value) {
        if (typeof value == 'number') {
            return value.toFixed(this.numberPrecision);
        }
        if (value === false || value) {
            return value.toString();
        }
        return '';
    };
    PrimitiveAttributeParser.prototype.visible = function (value) {
        return true;
    };
    return PrimitiveAttributeParser;
}());
exports.PrimitiveAttributeParser = PrimitiveAttributeParser;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextureAttributeParser = (function () {
    function TextureAttributeParser() {
    }
    TextureAttributeParser.prototype.parse = function (str, value) {
        var texture = PIXI.utils.TextureCache[str];
        if (texture instanceof PIXI.Texture) {
            return texture;
        }
        return value;
    };
    TextureAttributeParser.prototype.stringify = function (value) {
        return value.textureCacheIds[0];
    };
    TextureAttributeParser.prototype.visible = function (value) {
        return !!value.textureCacheIds;
    };
    return TextureAttributeParser;
}());
exports.TextureAttributeParser = TextureAttributeParser;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AutoAttributeParser_1 = require("../attributes/AutoAttributeParser");
function domAttr(parser) {
    return function (target, propertyName) {
        if (!target.hasOwnProperty('__pixi_inspector_class_attributes__')) {
            target['__pixi_inspector_class_attributes__'] = [];
        }
        var classAttributes = target['__pixi_inspector_class_attributes__'];
        if (!classAttributes.some(function (it) { return it.name == propertyName; })) {
            classAttributes.push({
                name: propertyName,
                parser: typeof parser == 'function' ? new parser() : (parser || new AutoAttributeParser_1.AutoAttributeParser())
            });
        }
        if (!target.hasOwnProperty('__pixi_inspector_attributes__')) {
            Object.defineProperty(target, '__pixi_inspector_attributes__', {
                get: function () {
                    var superClassAttributes = Object.getPrototypeOf(target)['__pixi_inspector_attributes__'];
                    if (Array.isArray(superClassAttributes)) {
                        return superClassAttributes.concat(classAttributes);
                    }
                    return classAttributes;
                }
            });
        }
    };
}
exports.domAttr = domAttr;

},{"../attributes/AutoAttributeParser":3}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function domHidden() {
    return function (constructor) {
        constructor.prototype['__pixi_inspector_is_hidden__'] = true;
    };
}
exports.domHidden = domHidden;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function domLeaf() {
    return function (constructor) {
        constructor.prototype['__pixi_inspector_is_leaf__'] = true;
    };
}
exports.domLeaf = domLeaf;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PixiInspector_1 = require("./PixiInspector");
var PointAttributeParser_1 = require("./attributes/PointAttributeParser");
var TextureAttributeParser_1 = require("./attributes/TextureAttributeParser");
var ColorAttributeParser_1 = require("./attributes/ColorAttributeParser");
function getDefault(rootNode, canvas) {
    return new PixiInspector_1.PixiInspector(rootNode, canvas)
        .domAttr(PIXI.DisplayObject, 'x')
        .domAttr(PIXI.DisplayObject, 'y')
        .domAttr(PIXI.DisplayObject, 'scale', PointAttributeParser_1.PointAttributeParser)
        .domAttr(PIXI.DisplayObject, 'rotation')
        .domAttr(PIXI.DisplayObject, 'alpha')
        .domAttr(PIXI.Sprite, 'texture', TextureAttributeParser_1.TextureAttributeParser)
        .domAttr(PIXI.Sprite, 'anchor', PointAttributeParser_1.PointAttributeParser)
        .domAttr(PIXI.Sprite, 'tint', ColorAttributeParser_1.ColorAttributeParser)
        .domAttr(PIXI.mesh.Mesh, 'texture', TextureAttributeParser_1.TextureAttributeParser)
        .domAttr(PIXI.mesh.Mesh, 'tint', ColorAttributeParser_1.ColorAttributeParser)
        .domAttr(PIXI.Text, 'text')
        .domAttr(PIXI.Text, 'anchor', PointAttributeParser_1.PointAttributeParser)
        .domAttr(PIXI.extras.BitmapText, 'text')
        .domAttr(PIXI.extras.BitmapText, 'anchor', PointAttributeParser_1.PointAttributeParser)
        .domAttr(PIXI.extras.BitmapText, 'tint', ColorAttributeParser_1.ColorAttributeParser);
}
exports.getDefault = getDefault;

},{"./PixiInspector":1,"./attributes/ColorAttributeParser":4,"./attributes/PointAttributeParser":5,"./attributes/TextureAttributeParser":7}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PixiInspector_1 = require("./PixiInspector");
exports.PixiInspector = PixiInspector_1.PixiInspector;
var getDefault_1 = require("./getDefault");
exports.getDefault = getDefault_1.getDefault;
var domAttr_1 = require("./decorators/domAttr");
exports.domAttr = domAttr_1.domAttr;
var domLeaf_1 = require("./decorators/domLeaf");
exports.domLeaf = domLeaf_1.domLeaf;
var domHidden_1 = require("./decorators/domHidden");
exports.domHidden = domHidden_1.domHidden;
var PrimitiveAttributeParser_1 = require("./attributes/PrimitiveAttributeParser");
exports.PrimitiveAttributeParser = PrimitiveAttributeParser_1.PrimitiveAttributeParser;
var PointAttributeParser_1 = require("./attributes/PointAttributeParser");
exports.PointAttributeParser = PointAttributeParser_1.PointAttributeParser;
var ArrayAttributeParser_1 = require("./attributes/ArrayAttributeParser");
exports.ArrayAttributeParser = ArrayAttributeParser_1.ArrayAttributeParser;
var TextureAttributeParser_1 = require("./attributes/TextureAttributeParser");
exports.TextureAttributeParser = TextureAttributeParser_1.TextureAttributeParser;

},{"./PixiInspector":1,"./attributes/ArrayAttributeParser":2,"./attributes/PointAttributeParser":5,"./attributes/PrimitiveAttributeParser":6,"./attributes/TextureAttributeParser":7,"./decorators/domAttr":8,"./decorators/domHidden":9,"./decorators/domLeaf":10,"./getDefault":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (typeof PIXI === 'undefined') {
    throw "pixi-inspector requires pixi.js to be loaded first";
}
var inspector = require("./inspector");
if (!PIXI.inspector) {
    PIXI.inspector = inspector;
}
else {
    for (var prop in inspector) {
        PIXI.inspector[prop] = inspector[prop];
    }
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = inspector;
}

},{"./inspector":12}]},{},[13])(13)
});


//# sourceMappingURL=pixi-inspector.js.map
