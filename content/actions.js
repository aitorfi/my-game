'use strict';

window.Actions = {
    damage1: {
        name: "Slash",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.slash },
            { type: utils.behaviorTypes.stateChange, damage: 10 }
        ]
    },
    damage2: {
        name: "Stab",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.stab },
            { type: utils.behaviorTypes.stateChange, damage: 15 }
        ]
    },
    damage3: {
        name: "Shoot",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.shoot },
            { type: utils.behaviorTypes.stateChange, damage: 12 }
        ]
    }
}
