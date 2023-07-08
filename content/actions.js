'use strict';

window.Actions = {
    damage1: {
        name: "Slash",
        description: "Slash your opponent with a chance to cause a bleeding.",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}!" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.slash },
            { 
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.damage,
                    damage: 15,
                    unit: utils.battleDamageUnits.hp
                }
            },
            {
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.status,
                    status: { ...Statuses["Bleeding"] },
                    chance: 1.00 // 0.20
                }
            }
        ],
        fail: [
            { type: utils.behaviorTypes.text, text: "{CASTER} tried to use {ACTION} but failed." }
        ],
        accuracy: 0.90
    },
    damage2: {
        name: "Stab",
        description: "Stab your opponent with a chance to cause a bleeding.",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}!" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.stab },
            { 
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.damage,
                    damage: 10,
                    unit: utils.battleDamageUnits.hp
                }
            }
        ],
        fail: [
            { type: utils.behaviorTypes.text, text: "{CASTER} tried to use {ACTION} but failed." }
        ],
        accuracy: 0.70
    },
    damage3: {
        name: "Shoot",
        description: "Shoot your opponent.",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}!" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.shoot },
            { 
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.damage,
                    damage: 7,
                    unit: utils.battleDamageUnits.hp
                }
            }
        ],
        fail: [
            { type: utils.behaviorTypes.text, text: "{CASTER} tried to use {ACTION} but failed." }
        ],
        accuracy: 0.70
    }
}
