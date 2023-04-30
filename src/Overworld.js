'use strict';

class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
    }

    init() {
        this.map = new OverworldMap(window.overworldMaps.demoRoomDebug);

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
    }

    startGameLoop() {
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);

            this.map.drawLowerImage(this.ctx);

            Object.values(this.map.gameObjects).forEach((object) => {
                object.sprite.draw(this.ctx);
                object.update({
                    direction: this.directionInput.direction
                });
            });

            this.map.drawUpperImage(this.ctx);

            window.requestAnimationFrame(() => {
                step();
            });
        };

        step();
    }
}
