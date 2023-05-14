'use strict';

class TurnCycle {
    constructor(config) {
        this.battle = config.battle;
        this.onNewEvent = config.onNewEvent;
        this.currentTeam = "player";
    }

    async init() {
        await this.onNewEvent({
            type: utils.behaviorTypes.text,
            text: "The battle is starting!"
        });

        this.turn();
    }

    async turn() {
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];
        const targetId = this.battle.activeCombatants[(caster.team === "player") ? "enemy" : "player"];
        const target = this.battle.combatants[targetId];

        const submission = await this.onNewEvent({
            type: utils.behaviorTypes.submissionMenu,
            caster,
            target
        });

        const resultingEvents = submission.action.success;

        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                action: submission.action,
                caster: submission.caster,
                target: submission.target
            };

            await this.onNewEvent(event);
        }

        this.currentTeam = (this.currentTeam === "player") ? "enemy" : "player";
        this.turn();
    }
}
