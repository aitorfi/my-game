# Introduction

This is a game I'm making following the [Pizza Legends tutorial](https://www.youtube.com/playlist?list=PLcjhmZ8oLT0r9dSiIK6RB_PuBWlG1KSq_) by [Drew Conley](https://www.youtube.com/@DrewConley).

# Table of Contents

- [Documentation](#documentation)
    - [init.js](#initjs)
    - [Overworld](#overworld)
        - [The Game Loop](#the-game-loop)
    - [Overworld Map](#overworld-map)
        - [Cutscenes](#cutscenes)
        - [Tile Events](#tile-events)
        - [Action Events](#action-events)
        - [Walls (collisions)](#walls-collisions)
    - [Game Objects](#game-objects)
        - [Behavior Loops](#behavior-loops)
    - [Person Game Objects](#person-game-objects)
    - [Sprites](#sprites)

# Documentation

## init.js

The `init.js` file is the first thing that is executed when the windows loads and it only creates and initializes an `Overworld` object.

```js
window.onload = () => {
    const overworld = new Overworld({
        element: document.querySelector('.game-container')
    });
    
    overworld.init();
};
```

## Overworld

The `Overworld` class initializes the `OverworldMap`, binds user input events and starts the game loop.

### The Game Loop

The game loop is a recursive function that draws the map and its objects to the game canvas after updating their state.

```js
startGameLoop() {
    const step = () => {
        this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);

        const cameraObject = this.map.gameObjects.hero;

        cameraObject.update({
            direction: this.directionInput.direction,
            map: this.map
        });

        this.map.drawLowerImage(this.ctx, cameraObject);

        Object.values(this.map.gameObjects).sort((a, b) => {
            let verticalDiff = a.y - b.y;
            return (verticalDiff == 0) ? b.x - a.x : verticalDiff;
        }).forEach((object) => {
            if (object !== cameraObject) {
                object.update({
                    direction: this.directionInput.direction,
                    map: this.map
                });
            }

            object.sprite.draw(this.ctx, cameraObject);
        });

        this.map.drawUpperImage(this.ctx, cameraObject);

        window.requestAnimationFrame(() => {
            step();
        });
    };

    step();
}
```

## Overworld Map
The `OverworldMap` class contains methods to control the objects contained in it and play cutscenes.

### Cutscenes

Cutscenes are a succession of events handled by the the `OverworldEvent` class while player actions are ignored and game object behavior loops are paused. Cutscenes can be started from the `OverworldMap` class.

```js
async startCutscene(events) {
    this.isCutscenePlaying = true;

    this.stopBehaviorLoops();

    for (let i = 0; i < events.length; i++) {
        const eventHandler = new OverworldEvent({
            event: events[i],
            map: this
        });

        await eventHandler.init();

        if (events[i].type === utils.behaviorTypes.changeMap) {
            this.isCutscenePlaying = false;
            return;
        }
    }

    this.isCutscenePlaying = false;

    this.startBehaviorLoops();
}
```

### Tile Events

Tile events are cutscenes that are triggered when the player steps on certain tiles. These tiles and the events they trigger are configured in the map object in the file `/content/maps.js`:

```js
window.overworldMaps = {
    demoMap: {
        // Other configurations are made here too.
        tileEvents: {
            [utils.gridCoordinatesToPixelsStr(15, 13)]: [
                {
                    events: [
                        {type: utils.behaviorTypes.changeMap, map: "tent"}
                    ]
                }
            ]
        }
    }
}
```

The `OverworldMap` class has a method to check if the tile where a given game object is placed has events and play them in a cutscene.

```js
checkForTileEvent(target) {
    const tileEvents = this.tileEvents[`${target.x},${target.y}`];

    if (!this.isCutscenePlaying && tileEvents) {
        this.startCutscene(tileEvents[0].events);
    }
}
```

The `Overworld` class binds an event on the `PersonWalkBehaviorComplete` event and checks if there are any events to be played on the tile where the game object that triggered the event landed.

```js
bindPositionChangeEvent() {
    document.addEventListener("PersonWalkBehaviorComplete", (event) => {
        const target = this.map.gameObjects[event.detail.target];
        if (target.isPlayerControlled) {
            this.map.checkForTileEvent(target);
        }
    });
}
```

### Action Events

Action events are triggered when the player submits an action defined in the `Overworld` class.

```js
bindActionInputEvent() {
    new KeyPressListener(utils.controls.buttonA, () => {
        this.map.checkForActionCutscene();
    });
}
```

The `OverworldMap` class checks for events to be played in a cutscene when an action event is triggered. These events can only be dialogs so far.

```js
checkForActionCutscene() {
    const sourceObject = Object.values(this.gameObjects).find((object) => {
        return object.isPlayerControlled === true;
    });
    const nextCoords = utils.getNextPosition(
        sourceObject.x, sourceObject.y, sourceObject.direction);
    const targetObject = Object.values(this.gameObjects).find((object) => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && targetObject && targetObject.dialog.length) {
        targetObject.dialog[0].events.forEach((event) => {
            event.source = sourceObject;
            event.target = targetObject;
        });

        this.startCutscene(targetObject.dialog[0].events);
    }
}
```

Dialogs are configured on game objects within a map in the `/content/maps.js` file.

```js
window.overworldMaps = {
    tent: {
        gameObjects: {
            npc: new Person({
                // There are other properties configured here too.
                dialog: [
                    {
                        events: [
                            {type: utils.behaviorTypes.text, text: "I've been working on some battle strategies. Let's put them to the test shall we?", faceSource: true}
                        ]
                    }
                ]
            })
        }
    }
}
```

### Walls (collisions)

The map contains walls that prevent players and NPCs from stepping on then. A wall in the map could be visually represented by anything you want the player to collide with, not just literal walls. The `OverworldMap` class provides methods to add, remove and move walls.

```js
addWall(x, y) {
    this.walls[`${x},${y}`] = true;
}

removeWall(x, y) {
    delete this.walls[`${x},${y}`];
}

moveWall(currentX, currentY, direction) {
    const {x, y} = utils.getNextPosition(currentX, currentY, direction);
    this.removeWall(currentX, currentY);
    this.addWall(x, y);
}
```

The `OverworldMap` class also has a method that places a wall for each of the objects contained in the map, this method is meant to be called every time a map change happens.

```js
placeObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
        let object = this.gameObjects[key];

        object.id = key;
        object.place(this);
    });
}
```

## Game Objects

Game objects are placed on the map and they are capable of performing behavior loops, they contain a `Sprite` object which makes them visible on the game canvas and allows them to perform animations. The `GameObject` class can be subclassed to extend its functionality or add more complex behavior.

### Behavior Loops

Behavior loops are a succession of events performed in a loop by a game object. The behavior loop of a game object can be started by calling the `doBehaviorEvent` method of the `GameObject` class. A behavior loop is broken when the `Promise` returned by the `OverworldEvent` class contains an object with the property `stopBehavior` set to true.

```js
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
```

The `OverworldMap` class provides methods to start and stop the behavior loops of all the game objects contained in it.

```js
startBehaviorLoops() {
    Object.values(this.gameObjects).forEach((object) => {
        object.doBehaviorEvent(this);
    });
}

stopBehaviorLoops() {
    utils.createEvent("StopBehaviorLoops", {});
}
```

## Person Game Objects

The `Person` class extends from the `GameObject` class. Persons are game objects that can perform two behaviors: walk and stand idle.

Game objects are updated on every game loop iteration. When a person is updated a few things can happen:

- If the person is moving, in the middle of a walk behavior, its position is updated.
- If the person is not moving but a direction input has been sent a walk behavior is started in the given direction.
- If the person is not moving and a direction input is not provided then the person remains idle.

```js
update(state) {
    if (this.movingProgressRemaining > 0) {
        this.updatePosition();
    } else {
        if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.direction) {
            this.startBehavior({
                type: utils.behaviorTypes.walk,
                direction: state.direction,
                map: state.map
            });
        }

        this.setSpriteAnimation();
    }
}
```

The animation played by the `Sprite` of the game object is set when the object is updated.

```js
setSpriteAnimation() {
    if (this.movingProgressRemaining > 0) {
        this.sprite.setAnimation(
            utils.getWalkAnimationKeyForDirection(this.direction));
        return;
    }

    this.sprite.setAnimation(
        utils.getIdleAnimationKeyForDirection(this.direction));
}
```

Behaviors can also individually be started on a person game object by calling the `startBehavior` method.

```js
startBehavior(behavior) {
    this.direction = behavior.direction;

    switch(behavior.type) {
        case utils.behaviorTypes.walk:
            this.startWalkBehavior(behavior);
            break;

        case utils.behaviorTypes.idle:
            this.startIdleBehavior(behavior);
            break;
    }

    this.setSpriteAnimation();
}

startWalkBehavior(behavior) {
    if (behavior.map.isNextPositionBlocked(this.x, this.y, this.direction)) {
        if (behavior.retry) {
            setTimeout(() => {
                this.startBehavior(behavior);
            }, 500);
        }

        return;
    }

    behavior.map.moveWall(this.x, this.y, this.direction);
    this.movingProgressRemaining = utils.gridTileSizeInPixels;
}

startIdleBehavior(behavior) {
    setTimeout(() => {
        utils.createEvent("PersonIdleBehaviorComplete", {
            target: this.id
        });
    }, behavior.time);
}
```

## Sprites

The `Sprite` class updates the image and animations of a game object. The way in which a game object is drawn to the game canvas and its animations are configured in the `/content/maps.js` file.

```js
window.overworldMaps = {
    demoMap: {
        // There are other properties configured here too.
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordToPixels(18),
                y: utils.gridCoordToPixels(10),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/hero.png",
                animationFrameTime: 2,
                currentAnimation: utils.animationKeys.idleDown,
                animations: {
                    [utils.animationKeys.idleUp]: [ [0, 0] ],
                    [utils.animationKeys.idleLeft]: [ [0, 1] ],
                    [utils.animationKeys.idleDown]: [ [0, 2] ],
                    [utils.animationKeys.idleRight]: [ [0, 3] ],
                    [utils.animationKeys.walkUp]: [
                        [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
                    ],
                    [utils.animationKeys.walkLeft]: [
                        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]
                    ],
                    [utils.animationKeys.walkDown]: [
                        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]
                    ],
                    [utils.animationKeys.walkRight]: [
                        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]
                    ]
                }
            })
        }
    }
}
```

A sprite sheet contains several images of the same game object in different positions, each image is contained in a section called frame which size is defined by the `width` and `height` properties. The `animations` object defines which frames and in what order have to be played for each animation.

Sprites are drawn to the game canvas on every game loop iteration and the frame to be drawn is determined by the `updateAnimationProgress` method. For the animations to look smooth often the same frame has to be drawn for several game loop iterations, the number of iterations is defined by the `animationFrameTime` property.

```js
draw(ctx, cameraObject) {
    const [frameX, frameY] = this.frame;
    const [canvasCenterX, canvasCenterY] = utils.getGameCanvasCenterCoordinates();

    ctx.drawImage(
        this.image,
        frameX * this.gameObject.width,
        frameY * this.gameObject.height,
        this.gameObject.width,
        this.gameObject.height,
        this.gameObject.x + this.gameObject.displacementX + canvasCenterX - cameraObject.x,
        this.gameObject.y + this.gameObject.displacementY + canvasCenterY - cameraObject.y,
        this.gameObject.width,
        this.gameObject.height
    );

    this.updateAnimationProgress();
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
```
