'use strict';

window.Actions = {
    damage1: {
        name: "Slash",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}" },
            { type: utils.behaviorTypes.stateChange, damage: 10 }
        ]
    }
}
