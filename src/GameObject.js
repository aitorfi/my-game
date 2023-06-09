'use strict';

class GameObject {
    constructor(config) {
        this.id = null;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 0;
        this.height = config.height || 0;
        this.displacementX = config.displacementX || 0;
        this.displacementY = config.displacementY || 0;
        this.direction = config.direction || utils.directions.down;
        this.isPlaced = false;
        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
        this.behaviorLoopInProgress = false;
        this.dialog = config.dialog || [];

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "",
            animations: config.animations,
            currentAnimation: config.currentAnimation,
            animationFrameTime: config.animationFrameTime
        });
    }

    update() {
        
    }

    place(map) {
        map.addWall(this.x, this.y);
        this.isPlaced = true;
    }

    async doBehaviorEvent(map) {
        if (this.behaviorLoopInProgress ||
            map.isCutscenePlaying || 
            this.behaviorLoop.length == 0) {
            return;
        }

        this.behaviorLoopInProgress = true;

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.target = this.id;

        const eventHandler = new OverworldEvent({map, event: eventConfig});
        const promiseResolution = await eventHandler.init();

        this.behaviorLoopIndex++;

        if (this.behaviorLoopIndex == this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        this.behaviorLoopInProgress = false;

        if (promiseResolution && promiseResolution.stopBehavior) {
            return;
        }

        this.doBehaviorEvent(map);
    }
}
