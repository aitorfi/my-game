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
        this.revealingText.init();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (`
            <p></p>
            <button>Next</button>
        `);

        this.revealingText = new RevealingText({
            element: this.element.querySelector('p'),
            text: this.text
        });

        this.element.querySelector('button').onclick = () => {
            this.done();
        }

        this.actionListener = new KeyPressListener(utils.controls.buttonA, () => {
            this.done();
        });
    }

    done() {
        if (this.revealingText.isDone) {
            this.actionListener.unbind();
            this.element.remove();
            this.onComplete();
        } else {
            this.revealingText.skipRevealingEffect();
        }
    }
}
