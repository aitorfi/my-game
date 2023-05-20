---
layout: default
title: Map Change Events
nav_order: 3
parent: Overworld Events
---

# Map Change Events

The map change events are handled in the `OverworldEvent` class and consist in changing the reference of the `Overworld` class to the new map and initializing it. All behavior loops are stopped by the previous map as the event has to played in a cutscene and the behavior loops of the new map are started after the initialization. A short animation is played by the `SceneTransition` class too.

```js
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
```
