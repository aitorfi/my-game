---
layout: default
title: Idle and Walk Events
nav_order: 1
parent: Overworld Events
last_modified_date: 18/05/2023
---

# Idle and Walk events

The Idle and Walk events are very similar, the event must contain a `target` property which holds the id of the `GameObject` that will walk or stand idle. This id is used to retrieve the actual game object from the given map and a behavior of the given type will be started. Once the walk or idle behaviors are finished a `PersonIdleBehaviorComplete` or a `PersonWalkBehaviorComplete` custom event will be fired from the game object and the event will be resolved. Another way in which the event can be resolved is if a `StopBehaviorLoops` custom event if fired.

```js
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
```

```js
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
```
