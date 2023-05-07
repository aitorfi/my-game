'use strict';

class RevealingText {
    constructor(config) {
        this.element = config.element;
        this.text = config.text;
        this.delay = config.delay || 40;

        this.timeout = null;
        this.isDone = false;
        this.characters = [];
    }

    init() {
        this.text.split('').forEach((character) => {
            let span = document.createElement('span');
            span.textContent = character;
            this.element.appendChild(span);

            this.characters.push({
                span,
                delay: (character === ' ') ? 0 : this.delay
            });
        });

        this.revealText();
    }

    revealText() {
        const nextCharacter = this.characters.splice(0, 1)[0];
        nextCharacter.span.classList.add('revealed');

        if (this.characters.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealText();
            }, nextCharacter.delay);
        } else {
            this.isDone = true;
        }
    }

    skipRevealingEffect() {
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll('span').forEach((span) => {
            span.classList.add('revealed');
        });
    }
}
