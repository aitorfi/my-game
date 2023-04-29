'use strict';

const utils = {
    gridCoordinateToPixels(coordinate) {
        return coordinate * 32;
    },
    pixelCoordinateToGrid(coordinate) {
        return Math.floor(coordinate / 32);
    }
};
