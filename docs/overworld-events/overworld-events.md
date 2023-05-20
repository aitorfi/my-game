---
layout: default
title: Overworld Events
nav_order: 7
has_children: true
has_toc: false
last_modified_date: 18/05/2023
---

# Overworld Events

The `OverworldEvent` class is in charge of executing a given event on a given map, it handles several types of events and notifies the caller when the event is resolved by returning a `Promise` in the `init` method.

```js
init() {
    return new Promise((resolve) => {
        switch(this.event.type) {
            case utils.behaviorTypes.idle:
                this.idle(resolve);
                break;

            case utils.behaviorTypes.walk:
                this.walk(resolve);
                break;

            case utils.behaviorTypes.text:
                this.textMessage(resolve);
                break;

            case utils.behaviorTypes.changeMap:
                this.changeMap(resolve);
                break;
        }
    });
}
```
