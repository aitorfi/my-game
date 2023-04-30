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
            "idle-down" : [
                [0, 0]
            ]
        };

        this.currentAnimation = this.config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameTime = this.config.animationFrameTime || 16;
        this.animationFrameProgress = this.animationFrameTime;
    }

    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        this.animationFrameProgress = this.animationFrameTime;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        if (this.currentAnimation === key) {
            return;
        }

        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameTime;
    }

    draw(ctx) {
        const [frameX, frameY] = this.frame;

        ctx.drawImage(
            this.image,
            frameX * this.gameObject.width,
            frameY * this.gameObject.height,
            this.gameObject.width,
            this.gameObject.height,
            this.gameObject.x + this.gameObject.displacementX,
            this.gameObject.y + this.gameObject.displacementY,
            this.gameObject.width,
            this.gameObject.height
        );

        this.updateAnimationProgress();
    }
}
