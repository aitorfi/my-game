'use strict';

class Person extends GameObject {
    constructor(config) {
        super(config);

        this.isPlayerControlled = config.isPlayerControlled || false;
        this.movingProgressRemaining = 0;
        this.movementSpeed = config.movementSpeed || 1;

        this.directionUpdate = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1]
        };
    }

    update(state) {
        if (this.isPlayerControlled && this.movingProgressRemaining === 0 && state.direction) {
            this.direction = state.direction;
            this.movingProgressRemaining = utils.gridTileSizeInPixels;
        }

        this.updatePosition();
        this.updateSprite(state);
    }

    updatePosition() {
        if (this.movingProgressRemaining === 0) {
            return;
        }

        let [property, change] = this.directionUpdate[this.direction];
        this[property] += change * this.movementSpeed;
        this.movingProgressRemaining -= 1 * this.movementSpeed;
    }

    updateSprite(state) {
        if (this.movingProgressRemaining === 0 && !state.direction) {
            this.sprite.setAnimation("idle-" + this.direction);
            return;
        }

        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
        }
    }
}
