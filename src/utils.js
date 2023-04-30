'use strict';

const utils = {
    gridCoordinateToPixels(coordinate) {
        return coordinate * 32;
    },
    pixelCoordinateToGrid(coordinate) {
        return Math.floor(coordinate / 32);
    },
    getGameCanvasCenterCoordinates() {
        return [utils.gridCoordinateToPixels(8.5), utils.gridCoordinateToPixels(4)];
    }
};
