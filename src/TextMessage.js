'use strict';

class TextMessage {
    constructor({text, onComplete}) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
        this.actionListener = null;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (`
            <p>${this.text}</p>
            <button>Next</button>
        `);

        this.element.querySelector('button').onclick = () => {
            this.done();
        }

        this.actionListener = new KeyPressListener(utils.controls.buttonA, () => {
            this.actionListener.unbind();
            this.done();
        });
    }

    done() {
        this.element.remove();
        this.onComplete();
    }
}
