'use strict';

window.onload = () => {
    const overworld = new Overworld({
        element: document.querySelector('.game-container')
    });
    
    overworld.init();
};
