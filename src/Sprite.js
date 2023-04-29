'use strict';

class Sprite {
    constructor(config) {
        this.config = config;
        this.gameObject = this.config.gameObject;

        this.setupImage();
        this.setupAnimations();
    }

    setupImage() {
        this.image = new Image();
        this.image.src = this.config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        };
    }

    setupAnimations() {
        this.animations = this.config.animations || {
            idleDown : [
                [0, 0]
            ]
        };

        this.currentAnimation = this.config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0;
    }

    draw(ctx) {
        const currentFrame = this.animations[this.currentAnimation][this.currentAnimationFrame];

        ctx.drawImage(
            this.image,
            currentFrame[0] * this.gameObject.width,
            currentFrame[1] * this.gameObject.height,
            this.gameObject.width,
            this.gameObject.height,
            this.gameObject.x,
            this.gameObject.y,
            this.gameObject.width,
            this.gameObject.height
        );
    }
}
