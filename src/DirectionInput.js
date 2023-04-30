'use strict';

class DirectionInput {
    constructor() {
        this.heldDirection = [];

        this.keyMap = {
            "ArrowUp": "up",
            "KeyW": "up",
            "ArrowDown": "down",
            "KeyS": "down",
            "ArrowLeft": "left",
            "KeyA": "left",
            "ArrowRight": "right",
            "KeyD": "right"
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
