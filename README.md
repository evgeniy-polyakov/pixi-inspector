# Pixi Inspector

The tool allowing to browse PixiJS display tree in context menu.

## Getting Started

Create PixiJS application and the inspector:
```javascript
import * as PIXI from "pixi.js";
import {PixiInspector} from "pixi-inspector";

const app = new PIXI.Application();
const inspector = new PixiInspector(app.stage, app.renderer);
//... add display objects to your app
```

## Browsing Elements

Right click on the canvas displays context menu with display object tree under the mouse pointer.

## Configuration

The third argument of the constructor is the style of the context menu: `light` or `dark`.
If no style is specified, it is detected from the browser theme.