'use strict';

class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    init() {
        const map = new Image();
        map.src = "./img/maps/demo-map.png";
        map.onload = () => {
            this.ctx.drawImage(map, 0, 0);
        };

        const hero = new Image();
        hero.src = "./img/people/hero.png";
        hero.onload = () => {
            const heroConfig = {
                image: hero,
                spriteCutFromX: 0,
                spriteCutFromY: 128,
                spriteWidth: 64,
                spriteHeight: 64,
                mapX: utils.gridCoordinateToPixels(5),
                mapY: utils.gridCoordinateToPixels(3)
            };

            this.ctx.drawImage(
                heroConfig.image,
                heroConfig.spriteCutFromX,
                heroConfig.spriteCutFromY,
                heroConfig.spriteWidth,
                heroConfig.spriteHeight,
                heroConfig.mapX,
                heroConfig.mapY,
                heroConfig.spriteWidth,
                heroConfig.spriteHeight
            );
        };
    }
}
