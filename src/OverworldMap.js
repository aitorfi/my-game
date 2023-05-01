'use strict';

class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

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
}

window.overworldMaps = {
    demoRoomDebug: {
        lowerSrc: "../img/maps/demo-map-debug.png",
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
                    [utils.animationKeys.idleUp]: [
                        [0, 0]
                    ],
                    [utils.animationKeys.idleLeft]: [
                        [0, 1]
                    ],
                    [utils.animationKeys.idleDown]: [
                        [0, 2]
                    ],
                    [utils.animationKeys.idleRight]: [
                        [0, 3]
                    ],
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
    demoRoomDebugXLCollisions: {
        lowerSrc: "../img/maps/demo-map-debug-xl-collisions.png",
        upperSrc: "",
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
                    [utils.animationKeys.idleUp]: [
                        [0, 0]
                    ],
                    [utils.animationKeys.idleLeft]: [
                        [0, 1]
                    ],
                    [utils.animationKeys.idleDown]: [
                        [0, 2]
                    ],
                    [utils.animationKeys.idleRight]: [
                        [0, 3]
                    ],
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
    demoRoom: {
        lowerSrc: "../img/maps/demo-map.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordToPixels(5),
                y: utils.gridCoordToPixels(3),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/hero.png",
                isPlayerControlled: true,
                animationFrameTime: 2,
                movementSpeed: 2,
                currentAnimation: utils.animationKeys.idleDown,
                animations: {
                    [utils.animationKeys.idleUp]: [
                        [0, 0]
                    ],
                    [utils.animationKeys.idleLeft]: [
                        [0, 1]
                    ],
                    [utils.animationKeys.idleDown]: [
                        [0, 2]
                    ],
                    [utils.animationKeys.idleRight]: [
                        [0, 3]
                    ],
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
            })
        }
    }
};
