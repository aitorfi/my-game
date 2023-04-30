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
        ctx.drawImage(
            this.lowerImage,
            utils.gridCoordinateToPixels(8) - cameraObject.x,
            utils.gridCoordinateToPixels(5) - cameraObject.y
        );
    }

    drawUpperImage(ctx, cameraObject) {
        ctx.drawImage(
            this.upperImage,
            utils.gridCoordinateToPixels(8) - cameraObject.x,
            utils.gridCoordinateToPixels(5) - cameraObject.y
        );
    }
}

window.overworldMaps = {
    demoRoomDebug: {
        lowerSrc: "../img/maps/demo-map-debug.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordinateToPixels(5) - 16,
                y: utils.gridCoordinateToPixels(3),
                width: 64,
                height: 64,
                src: "../img/people/hero.png",
                isPlayerControlled: true,
                animationFrameTime: 2,
                movementSpeed: 2,
                currentAnimation: "walk-down",
                animations: {
                    "idle-up" : [
                        [0, 0]
                    ],
                    "idle-left" : [
                        [0, 1]
                    ],
                    "idle-down" : [
                        [0, 2]
                    ],
                    "idle-right" : [
                        [0, 3]
                    ],
                    "walk-up" : [
                        [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
                    ],
                    "walk-left" : [
                        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]
                    ],
                    "walk-down" : [
                        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]
                    ],
                    "walk-right" : [
                        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]
                    ]
                }
            }),
            npc: new Person({
                x: utils.gridCoordinateToPixels(3) - 16,
                y: utils.gridCoordinateToPixels(2),
                width: 64,
                height: 64,
                src: "../img/people/hero.png",
                animations: {
                    "idle-down" : [
                        [0, 2]
                    ]
                }
            })
        }
    },
    demoRoomDebugXL: {
        lowerSrc: "../img/maps/demo-map-debug-xl.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordinateToPixels(15) - 16,
                y: utils.gridCoordinateToPixels(7),
                width: 64,
                height: 64,
                src: "../img/people/hero.png",
                isPlayerControlled: true,
                animationFrameTime: 2,
                movementSpeed: 2,
                currentAnimation: "walk-down",
                animations: {
                    "idle-up" : [
                        [0, 0]
                    ],
                    "idle-left" : [
                        [0, 1]
                    ],
                    "idle-down" : [
                        [0, 2]
                    ],
                    "idle-right" : [
                        [0, 3]
                    ],
                    "walk-up" : [
                        [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
                    ],
                    "walk-left" : [
                        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]
                    ],
                    "walk-down" : [
                        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]
                    ],
                    "walk-right" : [
                        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]
                    ]
                }
            }),
            npc: new Person({
                x: utils.gridCoordinateToPixels(3) - 16,
                y: utils.gridCoordinateToPixels(2),
                width: 64,
                height: 64,
                src: "../img/people/hero.png",
                animations: {
                    "idle-down" : [
                        [0, 2]
                    ]
                }
            })
        }
    },
    demoRoom: {
        lowerSrc: "../img/maps/demo-map.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordinateToPixels(5) - 16,
                y: utils.gridCoordinateToPixels(3),
                width: 64,
                height: 64,
                src: "../img/people/hero.png",
                isPlayerControlled: true,
                animationFrameTime: 2,
                movementSpeed: 2,
                currentAnimation: "walk-down",
                animations: {
                    "idle-up" : [
                        [0, 0]
                    ],
                    "idle-left" : [
                        [0, 1]
                    ],
                    "idle-down" : [
                        [0, 2]
                    ],
                    "idle-right" : [
                        [0, 3]
                    ],
                    "walk-up" : [
                        [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
                    ],
                    "walk-left" : [
                        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]
                    ],
                    "walk-down" : [
                        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]
                    ],
                    "walk-right" : [
                        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]
                    ]
                }
            })
        }
    }
};
