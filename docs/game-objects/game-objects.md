---
layout: default
title: Game Objects
nav_order: 5
has_children: true
has_toc: false
last_modified_date: 14/05/2023
---

# Game Objects

Game objects are placed on the map and they are capable of performing behavior loops, they contain a `Sprite` object which makes them visible on the game canvas and allows them to perform animations. The `GameObject` class can be subclassed to extend its functionality or add more complex behavior.

## Behavior Loops

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
