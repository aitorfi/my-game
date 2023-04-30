'use strict';

class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
    }

    init() {
        this.map = new OverworldMap(window.overworldMaps.demoRoomDebugXLCollisions);

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
    }

    startGameLoop() {
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);

            const cameraObject = this.map.gameObjects.hero;

            cameraObject.update({
                direction: this.directionInput.direction
            });

            this.map.drawLowerImage(this.ctx, cameraObject);

            Object.values(this.map.gameObjects).forEach((object) => {
                if (object !== cameraObject) {
                    object.update({
                        direction: this.directionInput.direction
                    });
                }

                object.sprite.draw(this.ctx, cameraObject);
            });

            this.map.drawUpperImage(this.ctx, cameraObject);

            window.requestAnimationFrame(() => {
                step();
            });
        };

        step();
    }
}
