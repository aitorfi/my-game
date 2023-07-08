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
        idle: "idle",
        text: "text",
        changeMap: "changeMap",
        battle: "battle",
        submissionMenu: "submissionMenu",
        stateChange: "stateChange",
        battleAnimation: "battleAnimation",
        replacement: "replacement",
        replacementMenu: "replacementMenu",
        giveXp: "giveXp"
    },
    controls: {
        buttonA: "KeyC",
        buttonB: "KeyX",
        buttonStart: "KeyZ"
    },
    battleAnimations: {
        slash: "slash",
        stab: "stab",
        shoot: "shoot"
    },
    battleStateChangeTypes: {
        damage: "damage",
        status: "status"
    },
    battleDamageUnits: {
        hp: "hp",
        percentage: "percentage"
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
    getPreviousPosition(currentX, currentY, direction) {
        let x = currentX;
        let y = currentY;

        switch(direction) {
            case this.directions.left:
                x += this.gridTileSizeInPixels;
                break;

            case this.directions.right:
                x -= this.gridTileSizeInPixels;
                break;

            case this.directions.up:
                y += this.gridTileSizeInPixels;
                break;

            case this.directions.down:
                y -= this.gridTileSizeInPixels;
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
    },
    createEvent(name, detail) {
        document.dispatchEvent(new CustomEvent(name, {detail}));
    },
    getOppositeDirection(direction) {
        switch (direction) {
            case utils.directions.up:
                return utils.directions.down;
            case utils.directions.down:
                return utils.directions.up;
            case utils.directions.right:
                return utils.directions.left;
            case utils.directions.left:
                return utils.directions.right;
        }

        return null;
    },
    wait(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    },
    flipCoin(chance = 1) {
        if (chance === 1) {
            return true;
        }

        if (chance === 0) {
            return false;
        }
        
        // Get random number from 1 to 100
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        return randomNumber <= (chance * 100);
    }
};
