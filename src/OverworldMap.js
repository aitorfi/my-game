'use strict';

class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};

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
        Object.values(this.gameObjects).forEach((object) => {
            object.place(this);
        });
    }
}

window.overworldMaps = {
    demoRoomDebugSmall: {
        lowerSrc: "../img/maps/demo-map-debug-small.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordToPixels(5),
                y: utils.gridCoordToPixels(3),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/hero-debug.png",
                isPlayerControlled: true,
                animationFrameTime: 2,
                movementSpeed: 2,
                currentAnimation: utils.animationKeys.idleDown,
                animations: {
                    [utils.animationKeys.idleUp]: [ [0, 0] ],
                    [utils.animationKeys.idleLeft]: [ [0, 1] ],
                    [utils.animationKeys.idleDown]: [ [0, 2] ],
                    [utils.animationKeys.idleRight]: [ [0, 3] ],
                    [utils.animationKeys.walkUp]: [
                        [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
                    ],
                    [utils.animationKeys.walkLeft]: [
                        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]
                    ],
                    [utils.animationKeys.walkDown]: [
                        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]
                    ],
                    [utils.animationKeys.walkRight]: [
                        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]
                    ]
                }
            }),
            npc: new Person({
                x: utils.gridCoordToPixels(3),
                y: utils.gridCoordToPixels(2),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/hero.png",
                animations: {
                    [utils.animationKeys.idleDown]: [ [0, 2] ]
                }
            })
        }
    },
    demoRoomDebugLarge: {
        lowerSrc: "../img/maps/demo-map-debug-large-lower.png",
        upperSrc: "../img/maps/demo-map-debug-large-upper.png",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordToPixels(10),
                y: utils.gridCoordToPixels(4),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/hero-debug.png",
                isPlayerControlled: true,
                animationFrameTime: 2,
                movementSpeed: 2,
                currentAnimation: utils.animationKeys.idleDown,
                animations: {
                    [utils.animationKeys.idleUp]: [ [0, 0] ],
                    [utils.animationKeys.idleLeft]: [ [0, 1] ],
                    [utils.animationKeys.idleDown]: [ [0, 2] ],
                    [utils.animationKeys.idleRight]: [ [0, 3] ],
                    [utils.animationKeys.walkUp]: [
                        [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
                    ],
                    [utils.animationKeys.walkLeft]: [
                        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]
                    ],
                    [utils.animationKeys.walkDown]: [
                        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]
                    ],
                    [utils.animationKeys.walkRight]: [
                        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]
                    ]
                }
            }),
            guardLeft: new Person({
                x: utils.gridCoordToPixels(14),
                y: utils.gridCoordToPixels(10),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/plate-armor-soldier.png",
                animations: {
                    [utils.animationKeys.idleDown]: [ [0, 2] ]
                }
            }),
            guardRight: new Person({
                x: utils.gridCoordToPixels(16),
                y: utils.gridCoordToPixels(10),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/plate-armor-soldier.png",
                animations: {
                    [utils.animationKeys.idleDown]: [ [0, 2] ]
                }
            })
        },
        walls: {
            [utils.gridCoordinatesToPixelsStr(13, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(13, 8)]: true,
            [utils.gridCoordinatesToPixelsStr(13, 9)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 8)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 9)]: true,
            [utils.gridCoordinatesToPixelsStr(15, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(15, 8)]: true,
            // [utils.gridCoordinatesToPixelsStr(15, 9)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 8)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 9)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 8)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 9)]: true,
            [utils.gridCoordinatesToPixelsStr(20, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(20, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(21, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(21, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(22, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(22, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(23, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(23, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(24, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(24, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(25, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(25, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(26, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(26, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(27, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(27, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(28, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(28, 7)]: true
        }
    }
};
