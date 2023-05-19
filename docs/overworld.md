---
layout: default
title: Overworld
nav_order: 3
---

# Overworld

The `Overworld` class initializes the `OverworldMap`, binds user input events and starts the game loop.
{: .fs-6 .fw-300 }

## The Game Loop

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
