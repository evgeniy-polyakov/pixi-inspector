import {AttributeParser} from "./AttributeParser";

export class TextureAttributeParser implements AttributeParser<PIXI.Texture> {

    parse(str: string, value?: PIXI.Texture): PIXI.Texture {
        let texture = PIXI.utils.TextureCache[str];
        if (texture instanceof PIXI.Texture) {
            return texture;
        }
        return value;
    }

    stringify(value: PIXI.Texture): string {
        return value.textureCacheIds[0];
    }

    visible(value: PIXI.Texture): boolean {
        return !!value.textureCacheIds;
    }
}