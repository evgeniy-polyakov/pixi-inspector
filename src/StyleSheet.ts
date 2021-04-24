// language=CSS
export const StyleSheet = `
    .pixi-inspector-context-menu,
    .pixi-inspector-context-menu ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .pixi-inspector-texture-popup,
    .pixi-inspector-context-menu {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
        color: #202124;
        background: #fff;
        border: 1px solid #dadce0;
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
    }

    .pixi-inspector-context-menu li label span {
        padding: 0.3em 0;
        display: inline-block;
    }

    .pixi-inspector-context-menu li label:hover {
        background: #c8c8c9;
    }

    .pixi-inspector-context-menu ul > li > .branch {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0.8em;
        border-left: #72777c 1px dotted;
        pointer-events: none;
    }

    .pixi-inspector-context-menu ul > li > .branch:before {
        content: '';
        position: absolute;
        top: 0.9em;
        left: 0;
        width: 100%;
        border-top: #72777c 1px dotted;
    }

    .pixi-inspector-context-menu ul > li:last-child > .branch {
        height: 0.8em;
    }

    .pixi-inspector-context-menu li[data-visible=false] {
        color: #72777c;
    }

    .pixi-inspector-context-menu span[data-texture] u {
        text-decoration: underline;
    }

    .pixi-inspector-texture-popup {
        min-width: 72px;
        object-fit: contain;
        object-position: center;
        pointer-events: none;
        background-image: url("data:image/svg+xml;utf8,${encodeURIComponent('<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect height="12" width="12" y="0" x="12" fill="#dadce0"/><rect height="12" width="12" y="12" x="0" fill="#dadce0"/></svg>')}");
    }

    .pixi-inspector-texture-popup-dark {
        background-image: url("data:image/svg+xml;utf8,${encodeURIComponent('<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect height="12" width="12" y="0" x="12" fill="#3c4043"/><rect height="12" width="12" y="12" x="0" fill="#3c4043"/></svg>')}");
    }

    .pixi-inspector-context-menu-dark,
    .pixi-inspector-texture-popup-dark {
        color: #e8eaed;
        background-color: #292a2d;
        border-color: #3c4043;
    }

    .pixi-inspector-context-menu-dark li label:hover {
        background-color: #4b4c4f;
    }

    .pixi-inspector-context-menu-dark ul > li > .branch,
    .pixi-inspector-context-menu-dark ul > li > .branch:before {
        border-color: #8b9196;
    }

    .pixi-inspector-context-menu-dark li[data-visible=false] {
        color: #8b9196;
    }
`;