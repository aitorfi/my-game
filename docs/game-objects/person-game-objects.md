---
layout: default
title: Person Game Objects
nav_order: 1
parent: Game Objects
---

# Person Game Objects

The `Person` class extends from the `GameObject` class. Persons are game objects that can perform two behaviors: walk and stand idle.
{: .fs-6 .fw-300 }

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
