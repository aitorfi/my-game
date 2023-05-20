---
layout: default
title: Sprites
nav_order: 6
last_modified_date: 14/05/2023
---

# Sprites

The `Sprite` class updates the image and animations of a game object. The way in which a game object is drawn to the game canvas and its animations are configured in the `/content/maps.js` file.

```js
window.overworldMaps = {
    demoMap: {
        // There are other properties configured here too.
        gameObjects: {
            hero: new Person({
                x: utils.gridCoordToPixels(18),
                y: utils.gridCoordToPixels(10),
                width: 64,
                height: 64,
                displacementX: -16,
                displacementY: -32,
                src: "../img/people/hero.png",
                animationFrameTime: 2,
                currentAnimation: utils.animationKeys.idleDown,
                animations: {
                    [utils.animationKeys.idleUp]: [ [0, 0] ],
                    [utils.animationKeys.idleLeft]: [ [0, 1] ],
                    [utils.animationKeys.idleDown]: [ [0, 2] ],
                    [utils.animationKeys.idleRight]: [ [0, 3] ],
                    [utils.animationKeys.walkUp]: [
                        [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
                    ],
                    [utils.animationKeys.walkLeft]: [
                        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]
                    ],
                    [utils.animationKeys.walkDown]: [
                        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]
                    ],
                    [utils.animationKeys.walkRight]: [
                        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]
                    ]
                }
            })
        }
    }
}
```

A sprite sheet contains several images of the same game object in different positions, each image is contained in a section called frame which size is defined by the `width` and `height` properties. The `animations` object defines which frames and in what order have to be played for each animation.

Sprites are drawn to the game canvas on every game loop iteration and the frame to be drawn is determined by the `updateAnimationProgress` method. For the animations to look smooth often the same frame has to be drawn for several game loop iterations, the number of iterations is defined by the `animationFrameTime` property.

```js
draw(ctx, cameraObject) {
    const [frameX, frameY] = this.frame;
    const [canvasCenterX, canvasCenterY] = utils.getGameCanvasCenterCoordinates();

    ctx.drawImage(
        this.image,
        frameX * this.gameObject.width,
        frameY * this.gameObject.height,
        this.gameObject.width,
        this.gameObject.height,
        this.gameObject.x + this.gameObject.displacementX + canvasCenterX - cameraObject.x,
        this.gameObject.y + this.gameObject.displacementY + canvasCenterY - cameraObject.y,
        this.gameObject.width,
        this.gameObject.height
    );

    this.updateAnimationProgress();
}

updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
        this.animationFrameProgress -= 1;
        return;
    }

    this.animationFrameProgress = this.animationFrameTime;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
        this.currentAnimationFrame = 0;
    }
}

get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
}
```
