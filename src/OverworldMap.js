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

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this
            });

            await eventHandler.init();
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
                    [utils.animationKeys.idleUp]: [ [0, 0] ],
                    [utils.animationKeys.idleLeft]: [ [0, 1] ],
                    [utils.animationKeys.idleDown]: [ [0, 2] ],
                    [utils.animationKeys.idleRight]: [ [0, 3] ]
                }
            })
        }
    },
    demoRoomDebugLarge: {
        lowerSrc: "../img/maps/demo-map-debug-large-lower.png",
        upperSrc: "../img/maps/demo-map-debug-large-upper.png",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordToPixels(18),
                y: utils.gridCoordToPixels(6),
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
                },
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "What are you looking at? Get lost.", faceSource: true}
                        ]
                    }
                ]
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
                    [utils.animationKeys.idleUp]: [ [0, 0] ],
                    [utils.animationKeys.idleLeft]: [ [0, 1] ],
                    [utils.animationKeys.idleDown]: [ [0, 2] ],
                    [utils.animationKeys.idleRight]: [ [0, 3] ]
                },
                behaviorLoop: [
                    {type: utils.behaviorTypes.idle, direction: utils.directions.down, time: 2000},
                    {type: utils.behaviorTypes.idle, direction: utils.directions.right, time: 1000}
                ],
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "Fuck mate! I really gotta piss.", faceSource: true}
                        ]
                    }
                ]
            }),
            patrolSoldier: new Person({
                x: utils.gridCoordToPixels(15),
                y: utils.gridCoordToPixels(13),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                animationFrameTime: 4,
                src: "../img/people/chain-armor-soldier.png",
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
                },
                behaviorLoop: [
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right}
                ],
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "My feet hurt so bad. God I hate my job...", faceSource: true}
                        ]
                    }
                ]
            }),
            merchant: new GameObject({
                x: utils.gridCoordToPixels(26),
                y: utils.gridCoordToPixels(7),
                width: 32,
                height: 32,
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "Greetings, how may I help you?", faceSource: true}
                        ]
                    }
                ]
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
        },
        tileEvents: {
            [utils.gridCoordinatesToPixelsStr(15, 10)]: [
                {
                    events: [
                        {target: "guardLeft", type: "idle", direction: "right"},
                        {target: "guardLeft", type: "text", text: "Hey! You can't get in there, go away."},
                        {target: "hero", type: "walk", direction: "down"},
                        {target: "guardLeft", type: "idle", direction: "down"}
                    ]
                }
            ]
        }
    },
    demoMap: {
        lowerSrc: "../img/maps/demo-map-lower.png",
        upperSrc: "../img/maps/demo-map-upper.png",
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordToPixels(18),
                y: utils.gridCoordToPixels(10),
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
                y: utils.gridCoordToPixels(14),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/plate-armor-soldier.png",
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
                },
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "What are you looking at? Get lost.", faceSource: true}
                        ]
                    }
                ]
            }),
            guardRight: new Person({
                x: utils.gridCoordToPixels(16),
                y: utils.gridCoordToPixels(14),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/plate-armor-soldier.png",
                animations: {
                    [utils.animationKeys.idleUp]: [ [0, 0] ],
                    [utils.animationKeys.idleLeft]: [ [0, 1] ],
                    [utils.animationKeys.idleDown]: [ [0, 2] ],
                    [utils.animationKeys.idleRight]: [ [0, 3] ]
                },
                behaviorLoop: [
                    {type: utils.behaviorTypes.idle, direction: utils.directions.down, time: 2000},
                    {type: utils.behaviorTypes.idle, direction: utils.directions.right, time: 1000}
                ],
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "Fuck mate! I really gotta piss.", faceSource: true}
                        ]
                    }
                ]
            }),
            patrolSoldier: new Person({
                x: utils.gridCoordToPixels(15),
                y: utils.gridCoordToPixels(17),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                animationFrameTime: 4,
                src: "../img/people/chain-armor-soldier.png",
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
                },
                behaviorLoop: [
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.left},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right},
                    {type: utils.behaviorTypes.walk, direction: utils.directions.right}
                ],
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "My feet hurt so bad. God I hate my job...", faceSource: true}
                        ]
                    }
                ]
            }),
            merchant: new GameObject({
                x: utils.gridCoordToPixels(26),
                y: utils.gridCoordToPixels(11),
                width: 32,
                height: 32,
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "Greetings, how may I help you?", faceSource: true}
                        ]
                    }
                ]
            })
        },
        walls: {
            // Tent:
            [utils.gridCoordinatesToPixelsStr(13, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(13, 12)]: true,
            [utils.gridCoordinatesToPixelsStr(13, 13)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 12)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 13)]: true,
            [utils.gridCoordinatesToPixelsStr(15, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(15, 12)]: true,
            // [utils.gridCoordinatesToPixelsStr(15, 13)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 12)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 13)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 12)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 13)]: true,
            // Merchants:
            [utils.gridCoordinatesToPixelsStr(20, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(20, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(21, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(21, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(22, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(22, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(23, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(23, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(24, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(24, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(25, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(25, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(26, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(26, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(27, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(27, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(28, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(28, 11)]: true,
            // Map Top Border:
            [utils.gridCoordinatesToPixelsStr(9, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(10, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(11, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(12, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(13, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(15, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(18, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(19, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(20, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(21, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(22, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(23, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(24, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(25, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(26, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(27, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(28, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(29, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(30, 3)]: true,
            [utils.gridCoordinatesToPixelsStr(31, 3)]: true,
            // Map Bottom Border:
            [utils.gridCoordinatesToPixelsStr(9, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(10, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(11, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(12, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(13, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(14, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(15, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(16, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(17, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(18, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(19, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(20, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(21, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(22, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(23, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(24, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(25, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(26, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(27, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(28, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(29, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(30, 20)]: true,
            [utils.gridCoordinatesToPixelsStr(31, 20)]: true,
            // Map Left Border:
            [utils.gridCoordinatesToPixelsStr(8, 4)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 5)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 8)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 9)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 12)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 13)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 14)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 15)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 16)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 17)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 18)]: true,
            [utils.gridCoordinatesToPixelsStr(8, 19)]: true,
            // Map Right Border:
            [utils.gridCoordinatesToPixelsStr(32, 4)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 5)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 6)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 7)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 8)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 9)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 10)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 11)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 12)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 13)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 14)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 15)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 16)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 17)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 18)]: true,
            [utils.gridCoordinatesToPixelsStr(32, 19)]: true

        },
        tileEvents: {
            // [utils.gridCoordinatesToPixelsStr(15, 14)]: [
            //     {
            //         events: [
            //             {target: "guardLeft", type: "idle", direction: "right"},
            //             {target: "guardLeft", type: "text", text: "Hey! You can't get in there, go away."},
            //             {target: "hero", type: "walk", direction: "down"},
            //             {target: "guardLeft", type: "idle", direction: "down"}
            //         ]
            //     }
            // ],
            [utils.gridCoordinatesToPixelsStr(15, 13)]: [
                {
                    events: [
                        {type: utils.behaviorTypes.changeMap, map: "demoRoomDebugSmall"}
                    ]
                }
            ]
        }
    }
};
