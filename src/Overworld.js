'use strict';

class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    init() {
        const map = new Image();
        map.src = "./img/maps/demo-map-debug.png";
        map.onload = () => {
            this.ctx.drawImage(map, 0, 0);
        };

        const hero = new GameObject({
            x: utils.gridCoordinateToPixels(5) - 16,
            y: utils.gridCoordinateToPixels(3),
            width: 64,
            height: 64,
            src: "./img/people/hero.png",
            animations: {
                idleDown : [
                    [0, 2]
                ]
            }
        });

        setTimeout(() => {
            hero.sprite.draw(this.ctx);
        }, 200);
    }
}
