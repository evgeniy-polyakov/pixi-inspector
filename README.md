# Pixi Inspector

The tool allowing to map PixiJS display tree to DOM that could be
inspected and modified in browser development tools.

## Getting Started

Create PixiJS application and initialize default inspector
```javascript
var app = new PIXI.Application();
PIXI.inspector.getDefault(app.stage, app.view);
//... add display objects to your app
```

This creates the inspector with default set of element attributes.
Open the browser DOM inspector and locate an element under your canvas.
It will be a `px-container` element containing all PixiJS display tree mapped to elements
like `px-container`, `px-sprite`, `px-text`, `px-yourclassname`.
Attributes of each element can be modified, the modification reflects the display tree immediately.
For example changing `x` attribute of an element will change the `x` position of the corresponding
display object.

## Browsing Elements

1. The elements can be selected in browser DOM inspector like it's usually done for regular html.
2. The elements can be selected by mouse with `Ctrl` key pressed. When the key is down the elements
are highlighted by white rectangle. Selecting an element in this mode sets variable `$pixi`
to the corresponding display object that can be used in the console.

## Configuration
### Configuring Attributes
### Using Decorators