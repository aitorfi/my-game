---
layout: default
title: Cutscenes
nav_order: 1
parent: Overworld Map
last_modified_date: 14/05/2023
---

# Cutscenes

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
