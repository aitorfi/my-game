'use strict';

class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 0;
        this.height = config.height || 0;
        this.direction = config.direction || "down";

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
            animations: config.animations,
            currentAnimation: config.currentAnimation,
            animationFrameTime: config.animationFrameTime
        });
    }
}
