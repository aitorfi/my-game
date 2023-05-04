'use strict';

class KeyPressListener {
    constructor(keyCode, callback) {
        this.isSafe = true;

        this.keyDownFunction = (event) => {
            if (event.code === keyCode && this.isSafe) {
                this.isSafe = false;
                callback();
            }
        };

        this.keyUpFunction = (event) => {
            if (event.code === keyCode) {
                this.isSafe = true;
            }
        };

        document.addEventListener("keydown", this.keyDownFunction);
        document.addEventListener("keyup", this.keyUpFunction);
    }

    unbind() {
        document.removeEventListener("keydown", this.keyDownFunction);
        document.removeEventListener("keyup", this.keyUpFunction);
    }
}
