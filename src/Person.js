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
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            if (this.isPlayerControlled && state.direction) {
                this.startBehavior({
                    type: utils.behaviorTypes.walk,
                    direction: state.direction,
                    map: state.map
                });
            }

            this.setSpriteAnimation();
        }
    }

    updatePosition() {
        let [property, change] = this.directionUpdate[this.direction];
        this[property] += change * this.movementSpeed;
        this.movingProgressRemaining -= 1 * this.movementSpeed;
    }

    startBehavior(behavior) {
        this.direction = behavior.direction;
    
        if (behavior.type === utils.behaviorTypes.walk) {
            if (behavior.map.isNextPositionBlocked(this.x, this.y, this.direction)) {
                return;
            }

            behavior.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = utils.gridTileSizeInPixels;
        }
    }

    setSpriteAnimation() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation(
                utils.getWalkAnimationKeyForDirection(this.direction));
            return;
        }

        this.sprite.setAnimation(
            utils.getIdleAnimationKeyForDirection(this.direction));
    }
}
