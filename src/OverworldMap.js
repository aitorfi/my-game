'use strict';

class OverworldMap {
    constructor(config) {
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};
        this.tileEvents = config.tileEvents || {};

        this.isCutscenePlaying = false;

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx, cameraObject) {
        const [canvasCenterX, canvasCenterY] = utils.getGameCanvasCenterCoordinates();

        ctx.drawImage(
            this.lowerImage,
            canvasCenterX - cameraObject.x,
            canvasCenterY - cameraObject.y
        );
    }

    drawUpperImage(ctx, cameraObject) {
        const [canvasCenterX, canvasCenterY] = utils.getGameCanvasCenterCoordinates();

        ctx.drawImage(
            this.upperImage,
            canvasCenterX - cameraObject.x,
            canvasCenterY - cameraObject.y
        );
    }

    isNextPositionBlocked(currentX, currentY, direction) {
        const {x, y} = utils.getNextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x, y) {
        delete this.walls[`${x},${y}`];
    }

    moveWall(currentX, currentY, direction) {
        const {x, y} = utils.getNextPosition(currentX, currentY, direction);
        this.removeWall(currentX, currentY);
        this.addWall(x, y);
    }

    placeObjects() {
        Object.keys(this.gameObjects).forEach((key) => {
            let object = this.gameObjects[key];

            object.id = key;
            object.place(this);
        });
    }

    checkForActionCutscene() {
        const sourceObject = Object.values(this.gameObjects).find((object) => {
            return object.isPlayerControlled === true;
        });
        const nextCoords = utils.getNextPosition(
            sourceObject.x, sourceObject.y, sourceObject.direction);
        const targetObject = Object.values(this.gameObjects).find((object) => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
        });

        if (!this.isCutscenePlaying && targetObject && targetObject.dialog.length) {
            targetObject.dialog[0].events.forEach((event) => {
                event.source = sourceObject;
                event.target = targetObject;
            });

            this.startCutscene(targetObject.dialog[0].events);
        }
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        utils.createEvent("StopBehaviorLoops", {});

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this
            });

            await eventHandler.init();

            if (events[i].type === utils.behaviorTypes.changeMap) {
                this.isCutscenePlaying = false;
                return;
            }
        }

        this.isCutscenePlaying = false;

        this.startBehaviorLoops();
    }

    startBehaviorLoops() {
        Object.values(this.gameObjects).forEach((object) => {
            object.doBehaviorEvent(this);
        });
    }

    checkForTileEvent(target) {
        const tileEvents = this.tileEvents[`${target.x},${target.y}`];

        if (!this.isCutscenePlaying && tileEvents) {
            this.startCutscene(tileEvents[0].events);
        }
    }
}
