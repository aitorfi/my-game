---
layout: default
title: init.js
nav_order: 2
last_modified_date: 14/05/2023
---

# init.js

The `init.js` file is the first thing that is executed when the window loads and it only creates and initializes an `Overworld` object.
{: .fs-6 .fw-300 }

```js
window.onload = () => {
    const overworld = new Overworld({
        element: document.querySelector('.game-container')
    });
    
    overworld.init();
};
```
