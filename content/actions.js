'use strict';

window.Actions = {
    damage1: {
        name: "Slash",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}!" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.slash },
            { 
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.damage,
                    damage: 10,
                    unit: utils.battleDamageUnits.hp
                }
            },
            {
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.status,
                    status: { ...Statuses["Bleeding"] },
                    chance: 0.20
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
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}!" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.stab },
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
                    chance: 0.10
                }
            }
        ],
        fail: [
            { type: utils.behaviorTypes.text, text: "{CASTER} tried to use {ACTION} but failed." }
        ],
        accuracy: 0.75
    },
    damage3: {
        name: "Shoot",
        success: [
            { type: utils.behaviorTypes.text, text: "{CASTER} uses {ACTION}!" },
            { type: utils.behaviorTypes.battleAnimation, animation: utils.battleAnimations.shoot },
            { 
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.damage,
                    damage: 12,
                    unit: utils.battleDamageUnits.hp
                }
            }
        ]
    }
}
