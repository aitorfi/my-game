---
layout: default
title: Walls (collisions)
nav_order: 4
parent: Overworld Map
last_modified_date: 14/05/2023
---

# Walls (collisions)

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
