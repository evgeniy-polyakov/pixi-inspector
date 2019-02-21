# Pixi Inspector

The tool allowing to map PixiJS display tree to DOM that could be
inspected and modified in browser development tools.

## Getting Started

Create PixiJS application and initialize default inspector:
```javascript
var app = new PIXI.Application();
var inspector = PIXI.inspector.getDefault(app.stage, app.view);
//... add display objects to your app
```

This creates the inspector with default set of element attributes.
Open the browser DOM inspector and locate an element under your canvas.
It will be a `px-container` element containing all PixiJS display tree mapped to elements
like `px-container`, `px-sprite`, `px-text`, `px-yourclassname`.
Attributes of each element can be modified, the modification reflects the display tree immediately.
For example changing `x` attribute of an element will change the `x` position of the corresponding
display object.

If you want to configure the inspector from scratch use the constructor.
Empty inspector does not show any attributes, just a tree of elements. 
```javascript
var app = new PIXI.Application();
var inspector = new PIXI.inspector.PixiInspector(app.stage, app.view);
//... configure the inspector
//... add display objects to your app
```

## Browsing Elements

1. The elements can be selected in browser DOM inspector like it's usually done for regular html.
2. The elements can be selected by mouse with `Ctrl` key pressed. When the key is down the elements
are highlighted by white rectangle. Selecting an element in this mode sets variable `$pixi`
to the corresponding display object that can be used in the console.

## Configuration

### Attributes
Set the attribute displayed in DOM inspector: 
```javascript
inspector
    .domAttr(PIXI.DisplayObject, 'x')
    .domAttr(PIXI.DisplayObject, 'y');
```
By default the attribute can parse primitive (string, number, boolean) or array of primitives.
If your object property is more complex use a custom attribute parser:
```javascript
inspector.domAttr(PIXI.DisplayObject, 'scale', PIXI.inspector.PointAttributeParser);
```

### Leaf Nodes
Set the type of leaf nodes in DOM inspector: 
```javascript
inspector.domLeaf(PIXI.spine.Spine);
```
That means that `Spine` objects are treated as single element without children.

### Hidden Nodes
Set the type of hidden nodes in DOM inspector:
```javascript
inspector.domHidden(PIXI.Graphics);
```
That means that `Graphics` objects are all hidden in DOM inspector.

## Decorators
Instead of configuring attributes and nodes in the inspector you can use
[Typescript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
to configure them directly in your classes.

### Attributes
```typescript
class MySprite extends PIXI.Sprite {
    @domAttr() readonly myNumber = 0;
    @domAttr(PIXI.inspector.PointAttributeParser) readonly myPoint = {x:0, y:0};
}
```

### Leaf Nodes
```typescript
@domLeaf()
class MySprite extends PIXI.Sprite {
}
```

### Hidden Nodes
```typescript
@domHidden()
class MySprite extends PIXI.Sprite {
}
```

## Attribute Parsers
Attribute parsers maps property of display object to DOM attribute and vice versa.
### Primitive
Parses string, number or boolean value.
You can set precision of numbers in the constructor argument, by default it's `2`.
```javascript
inspector.domAttr(PIXI.DisplayObject, 'x', new PIXI.inspector.PrimitiveAttributeParser(3));
```
### Array
Parses arrays. You can set array element parser which by default is `PrimitiveAttributeParser`.
```javascript
inspector.domAttr(PIXI.extras.AnimatedSprite, 'textures',
    new PIXI.inspector.ArrayAttributeParser(new PIXI.inspector.TextureAttributeParser()));
```
### Point
Parses objects with `x` and `y` numeric properties.
The attribute is in form `"x,y"` or `"x"` if `x` and `y` are equal.  
You can set precision of numbers in the constructor argument, by default it's `2`.
```javascript
inspector.domAttr(PIXI.Sprite, 'anchor', new PIXI.inspector.PointAttributeParser(3));
```
### Color
Parses numbers as color values. The attribute is in form `#RRGGBB`.
```javascript
inspector.domAttr(PIXI.Sprite, 'tint', PIXI.inspector.ColorAttributeParser);
```
### Texture
Parses `PIXI.Texture` objects. The attribute has value of texture key in the global cache.
Usually it's the name of texture file.
```javascript
inspector.domAttr(PIXI.Sprite, 'texture', PIXI.inspector.TextureAttributeParser);
```