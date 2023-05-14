# Introduction

This is a game I'm making following the [Pizza Legends tutorial](https://www.youtube.com/playlist?list=PLcjhmZ8oLT0r9dSiIK6RB_PuBWlG1KSq_) by [Drew Conley](https://www.youtube.com/@DrewConley).

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
