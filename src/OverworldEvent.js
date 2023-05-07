'use strict';

class OverworldEvent {
    constructor({map, event}) {
        this.map = map;
        this.event = event;
    }

    idle(resolve) {
        const target = this.map.gameObjects[this.event.target];
        target.startBehavior({
            type: this.event.type,
            direction: this.event.direction,
            time: this.event.time,
            map: this.map
        });

        const onBehaviorComplete = (event) => {
            if (event.detail.target !== this.event.target) {
                return;
            }
            
            document.removeEventListener(
                "PersonIdleBehaviorComplete",
                onBehaviorComplete
            );

            resolve();
        }

        document.addEventListener(
            "PersonIdleBehaviorComplete",
            onBehaviorComplete
        );
    }

    walk(resolve) {
        const target = this.map.gameObjects[this.event.target];
        target.startBehavior({
            type: this.event.type,
            direction: this.event.direction,
            retry: true,
            map: this.map
        });

        const onBehaviorComplete = (event) => {
            if (event.detail.target !== this.event.target) {
                return;
            }
            
            document.removeEventListener(
                "PersonWalkBehaviorComplete",
                onBehaviorComplete
            );

            resolve();
        }

        document.addEventListener(
            "PersonWalkBehaviorComplete",
            onBehaviorComplete
        );
    }

    textMessage(resolve) {
        if (this.event.faceSource) {
            this.event.target.direction = utils.getOppositeDirection(this.event.source.direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: resolve
        });
        message.init(document.querySelector('.game-container'));
    }

    changeMap(resolve) {
        this.map.overworld.initMap(window.overworldMaps[this.event.map]);
        resolve();
    }

    init() {
        return new Promise((resolve) => {
            switch(this.event.type) {
                case utils.behaviorTypes.idle:
                    this.idle(resolve);
                    break;

                case utils.behaviorTypes.walk:
                    this.walk(resolve);
                    break;

                case utils.behaviorTypes.text:
                    this.textMessage(resolve);
                    break;

                case utils.behaviorTypes.changeMap:
                    this.changeMap(resolve);
                    break;
            }
        });
    }
}
