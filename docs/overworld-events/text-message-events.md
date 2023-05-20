---
layout: default
title: Text Message Events
nav_order: 2
parent: Overworld Events
---

# Text Message Event

The `TextMessage` class creates a `div` element on which to place a given text, this element is placed on a given html container, usually the game canvas. The text is animated so that it is revealed character by character using the class `RevealingText`. To close the text container an action listener is bind by using the class `KeyPressListener`.

```js
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
```

The following snippet, extracted from the `OverworldEvent` class, shows an example of how to use the `TextMessage` class to prompt text.

```js
textMessage(resolve) {
    if (this.event.faceSource) {
        this.event.target.direction = utils.getOppositeDirection(this.event.source.direction);
    }

    const message = new TextMessage({
        text: this.event.text,
        onComplete: resolve
    });
    
    message.init(document.querySelector('.game-container'));
}
```
