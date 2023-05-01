'use strict';

class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 0;
        this.height = config.height || 0;
        this.displacementX = config.displacementX || 0;
        this.displacementY = config.displacementY || 0;
        this.direction = config.direction || utils.directions.down;
        this.isPlaced = false;

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
            animations: config.animations,
            currentAnimation: config.currentAnimation,
            animationFrameTime: config.animationFrameTime
        });
    }

    place(map) {
        map.addWall(this.x, this.y);
        this.isPlaced = true;
    }
}
