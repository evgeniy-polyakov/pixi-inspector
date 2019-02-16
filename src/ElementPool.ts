import {HTMLPixiElement} from "./HTMLPixiElement";

export class ElementPool {

    private readonly defaultConstructors: [Function, string][] = [
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

    private readonly pools: { [tagName: string]: HTMLPixiElement[] } = {};

    get(obj: PIXI.DisplayObject): HTMLPixiElement {
        let tagName = 'px-' + this.getTagName(obj).toLowerCase();
        if (!this.pools[tagName]) {
            customElements.define(tagName, function () {
            }, {extends: 'div'});
            this.pools[tagName] = [];
        }
        return this.pools[tagName].pop() || document.createElement(tagName) as HTMLPixiElement;
    }

    release(element: HTMLPixiElement) {
        if (this.pools[element.localName].indexOf(element) < 0) {
            this.pools[element.localName].push(element);
        }
    }

    private getTagName(obj: PIXI.DisplayObject): string {
        let className: string = null;
        if (obj.constructor) {
            let exec = /function\s+(\w{2,})\(/.exec(obj.constructor.toString());
            className = exec ? exec[1] : null;
        }
        if (className) {
            return className;
        }
        for (let defaultConstructor of this.defaultConstructors) {
            if (obj instanceof defaultConstructor[0]) {
                return defaultConstructor[1];
            }
        }
        return 'DisplayObject';
    }
}