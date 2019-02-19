import {PixiInspector} from "./PixiInspector";
import {PointAttributeParser} from "./attributes/PointAttributeParser";
import {TextureAttributeParser} from "./attributes/TextureAttributeParser";

export function getDefault(rootNode: PIXI.Container, canvas: HTMLCanvasElement) {
    return new PixiInspector(rootNode, canvas)
        .domAttr(PIXI.DisplayObject, 'x')
        .domAttr(PIXI.DisplayObject, 'y')
        .domAttr(PIXI.DisplayObject, 'scale', PointAttributeParser)
        .domAttr(PIXI.DisplayObject, 'rotation')
        .domAttr(PIXI.DisplayObject, 'alpha')
        .domAttr(PIXI.Sprite, 'texture', TextureAttributeParser)
        .domAttr(PIXI.Sprite, 'anchor', PointAttributeParser)
        .domAttr(PIXI.mesh.Mesh, 'texture', TextureAttributeParser)
        .domAttr(PIXI.Text, 'text')
        .domAttr(PIXI.Text, 'anchor', PointAttributeParser)
        .domAttr(PIXI.extras.BitmapText, 'text')
        .domAttr(PIXI.extras.BitmapText, 'anchor', PointAttributeParser);
}