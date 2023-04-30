'use strict';

class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage, 0, 0);
    }

    drawUpperImage(ctx) {
        ctx.drawImage(this.upperImage, 0, 0);
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
                animations: {
                    idleDown : [
                        [0, 2]
                    ]
                }
            }),
            hero1: new Person({
                x: utils.gridCoordinateToPixels(3) - 16,
                y: utils.gridCoordinateToPixels(2),
                width: 64,
                height: 64,
                src: "../img/people/hero.png",
                animations: {
                    idleDown : [
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
            hero: new GameObject({
                x: utils.gridCoordinateToPixels(5) - 16,
                y: utils.gridCoordinateToPixels(3),
                width: 64,
                height: 64,
                src: "../img/people/hero.png",
                animations: {
                    idleDown : [
                        [0, 2]
                    ]
                }
            })
        }
    }
};
