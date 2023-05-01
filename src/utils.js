'use strict';

const utils = {
    animationKeys: {
        idleUp: "idle-up",
        idleLeft: "idle-left",
        idleDown: "idle-down",
        idleRight: "idle-right",
        walkUp: "walk-up",
        walkLeft: "walk-left",
        walkDown: "walk-down",
        walkRight: "walk-right"
    },
    directions: {
        up: "up",
        down: "down",
        left: "left",
        right: "right"
    },
    gridTileSizeInPixels: 32,
    behaviorTypes: {
        walk: "walk",
        idle: "idle"
    },
    gridCoordToPixels(coordinate) {
        return coordinate * this.gridTileSizeInPixels;
    },
    gridCoordinatesToPixels(x, y) {
        return [this.gridCoordToPixels(x), this.gridCoordToPixels(y)];
    },
    gridCoordinatesToPixelsStr(x, y) {
        return `${this.gridCoordToPixels(x)},${this.gridCoordToPixels(y)}`;
    },
    pixelCoordToGrid(coordinate) {
        return Math.floor(coordinate / this.gridTileSizeInPixels);
    },
    pixelCoordinatesToGrid(x, y) {
        return [this.pixelCoordToGrid(x), this.pixelCoordToGrid(y)];
    },
    getGameCanvasCenterCoordinates() {
        return this.gridCoordinatesToPixels(8.5, 4);
    },
    getNextPosition(currentX, currentY, direction) {
        let x = currentX;
        let y = currentY;

        switch(direction) {
            case this.directions.left:
                x -= this.gridTileSizeInPixels;
                break;

            case this.directions.right:
                x += this.gridTileSizeInPixels;
                break;

            case this.directions.up:
                y -= this.gridTileSizeInPixels;
                break;

            case this.directions.down:
                y += this.gridTileSizeInPixels;
                break;
        }
        
        // ? Should return an array instead ? (For consistency with other methods)
        return {x, y};
    },
    getWalkAnimationKeyForDirection(direction) {
        switch(direction) {
            case this.directions.up:
                return this.animationKeys.walkUp;

            case this.directions.down:
                return this.animationKeys.walkDown;

            case this.directions.left:
                return this.animationKeys.walkLeft;

            case this.directions.right:
                return this.animationKeys.walkRight;
        }

        return "";
    },
    getIdleAnimationKeyForDirection(direction) {
        switch(direction) {
            case this.directions.up:
                return this.animationKeys.idleUp;

            case this.directions.down:
                return this.animationKeys.idleDown;

            case this.directions.left:
                return this.animationKeys.idleLeft;

            case this.directions.right:
                return this.animationKeys.idleRight;
        }

        return "";
    }
};
