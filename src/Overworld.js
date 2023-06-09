'use strict';

class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
    }

    init() {
        this.initMap(window.overworldMaps.demoMap);

        this.map.startCutscene([
            {target: "hero", type: "walk", direction: "down"},
            {target: "hero", type: "walk", direction: "down"},
            {target: "hero", type: "walk", direction: "down"},
            {target: "hero", type: "walk", direction: "down"},
            {target: "hero", type: "walk", direction: "down"}
        ]);

        this.bindActionInputEvent();
        this.bindPositionChangeEvent();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
    }

    initMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.placeObjects();
    }

    bindActionInputEvent() {
        new KeyPressListener(utils.controls.buttonA, () => {
            this.map.checkForActionCutscene();
        });
    }

    bindPositionChangeEvent() {
        document.addEventListener("PersonWalkBehaviorComplete", (event) => {
            const target = this.map.gameObjects[event.detail.target];
            if (target.isPlayerControlled) {
                this.map.checkForTileEvent(target);
            }
        });
    }

    startGameLoop() {
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);

            const cameraObject = this.map.gameObjects.hero;

            cameraObject.update({
                direction: this.directionInput.direction,
                map: this.map
            });

            this.map.drawLowerImage(this.ctx, cameraObject);

            Object.values(this.map.gameObjects).sort((a, b) => {
                let verticalDiff = a.y - b.y;
                return (verticalDiff == 0) ? b.x - a.x : verticalDiff;
            }).forEach((object) => {
                if (object !== cameraObject) {
                    object.update({
                        direction: this.directionInput.direction,
                        map: this.map
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
