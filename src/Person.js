'use strict';

class Person extends GameObject {
    constructor(config) {
        super(config);

        this.isPlayerControlled = config.isPlayerControlled || false;
        this.movingProgressRemaining = 0;

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
            this.movingProgressRemaining = 32;
        }

        this.updatePosition();
    }

    updatePosition() {
        if (this.movingProgressRemaining === 0) {
            return;
        }

        let [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;
    }
}
