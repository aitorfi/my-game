---
layout: default
title: Action Events
nav_order: 3
parent: Overworld Map
last_modified_date: 19/05/2023
---

# Action Events

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
                            {
                                type: utils.behaviorTypes.text,
                                text: "I've been working on some battle strategies. Let's put them to the test shall we?",
                                faceSource: true
                            }
                        ]
                    }
                ]
            })
        }
    }
}
```
