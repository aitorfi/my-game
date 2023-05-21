'use strict';

window.Statuses = {
    "Bleeding": {
        name: "Bleeding",
        expiresIn: 3,
        applicationEvents: [
            {
                type: utils.behaviorTypes.text,
                text: "{TARGET} is now under the effects of {ACTION}."
            }
        ],
        expirationEvents: [
            {
                type: utils.behaviorTypes.text,
                text: "{TARGET} is no longer bleeding."
            }
        ],
        successEvents: [
            {
                type: utils.behaviorTypes.text,
                text: "{TARGET} is bleeding."
            },
            {
                type: utils.behaviorTypes.stateChange,
                state: {
                    type: utils.battleStateChangeTypes.damage,
                    damage: 0.05,
                    unit: utils.battleDamageUnits.percentage
                }
            }
        ]
    }
};
