---
layout: default
title: Tile Events
nav_order: 2
parent: Overworld Map
---

# Tile Events

Tile events are cutscenes that are triggered when the player steps on certain tiles. These tiles and the events they trigger are configured in the map object in the file `/content/maps.js`:

```js
window.overworldMaps = {
    demoMap: {
        // Other configurations are made here too.
        tileEvents: {
            [utils.gridCoordinatesToPixelsStr(15, 13)]: [
                {
                    events: [
                        {
                            type: utils.behaviorTypes.changeMap,
                            map: "tent"
                        }
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
