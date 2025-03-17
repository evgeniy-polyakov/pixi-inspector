const textColorLight = "#202124";
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
export const StyleSheet = `
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
`;