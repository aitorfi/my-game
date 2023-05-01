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
    gridCoordToPixels(coordinate) {
        return coordinate * this.gridTileSizeInPixels;
    },
    gridCoordinatesToPixels(x, y) {
        return [this.gridCoordToPixels(x), this.gridCoordToPixels(y)];
    },
    pixelCoordToGrid(coordinate) {
        return Math.floor(coordinate / this.gridTileSizeInPixels);
    },
    pixelCoordinatesToGrid(x, y) {
        return [this.pixelCoordToGrid(x), this.pixelCoordToGrid(y)];
    },
    getGameCanvasCenterCoordinates() {
        return this.gridCoordinatesToPixels(8.5, 4);
    }
};
