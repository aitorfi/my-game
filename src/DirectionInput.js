'use strict';

class DirectionInput {
    constructor() {
        this.heldDirection = [];

        this.keyMap = {
            "ArrowUp": utils.directions.up,
            "KeyW": utils.directions.up,
            "ArrowDown": utils.directions.down,
            "KeyS": utils.directions.down,
            "ArrowLeft": utils.directions.left,
            "KeyA": utils.directions.left,
            "ArrowRight": utils.directions.right,
            "KeyD": utils.directions.right
        };
    }

    init() {
        document.addEventListener("keydown", e => {
            let dir = this.keyMap[e.code];

            if (dir && this.heldDirection.indexOf(dir) === -1) {
                this.heldDirection.unshift(dir);
            }
        });

        document.addEventListener("keyup", e => {
            let dir = this.keyMap[e.code];
            let index = this.heldDirection.indexOf(dir);

            if (dir && index > -1) {
                this.heldDirection.splice(index, 1);
            }
        });
    }

    get direction() {
        return this.heldDirection[0];
    }
}
