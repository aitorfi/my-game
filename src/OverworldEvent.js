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

            resolvePromise({ stopBehavior: false });
        }

        const onStopBehaviorLoops = () => {
            resolvePromise({ stopBehavior: true });
        }

        const resolvePromise = (promiseResolution) => {
            document.removeEventListener(
                "PersonIdleBehaviorComplete",
                onBehaviorComplete
            );

            document.removeEventListener(
                "StopBehaviorLoops",
                onStopBehaviorLoops
            );

            resolve(promiseResolution);
        }

        document.addEventListener(
            "PersonIdleBehaviorComplete",
            onBehaviorComplete
        );

        document.addEventListener(
            "StopBehaviorLoops",
            onStopBehaviorLoops
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
            
            resolvePromise({ stopBehavior: false });
        }

        const onStopBehaviorLoops = () => {
            resolvePromise({ stopBehavior: true });
        }

        const resolvePromise = (promiseResolution) => {
            document.removeEventListener(
                "PersonWalkBehaviorComplete",
                onBehaviorComplete
            );

            document.removeEventListener(
                "StopBehaviorLoops",
                onStopBehaviorLoops
            );

            resolve(promiseResolution);
        }

        document.addEventListener(
            "PersonWalkBehaviorComplete",
            onBehaviorComplete
        );

        document.addEventListener(
            "StopBehaviorLoops",
            onStopBehaviorLoops
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
        const sceneTransition = new SceneTransition();

        sceneTransition.init(document.querySelector('.game-container'), () => {
            const overworld = this.map.overworld;

            overworld.initMap(window.overworldMaps[this.event.map]);
            sceneTransition.fadeOut();
            overworld.map.startBehaviorLoops();
            resolve();
        });
    }

    battle(resolve) {
        const battle = new Battle({
            enemy: window.enemies[this.event.enemyId],
            onComplete: () => {
                resolve();
            }
        });
        
        battle.init(document.querySelector('.game-container'));
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

                case utils.behaviorTypes.battle:
                    this.battle(resolve);
                    break;
            }
        });
    }
}
