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
        let resultingEvents;
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];
        const targetId = this.battle.activeCombatants[(caster.team === "player") ? "enemy" : "player"];
        const target = this.battle.combatants[targetId];

        const submission = await this.onNewEvent({
            type: utils.behaviorTypes.submissionMenu,
            caster,
            target
        });

        if (utils.flipCoin(submission.action.accuracy)) {
            resultingEvents = submission.action.success;
        } else {
            resultingEvents = submission.action.fail;
        }

        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                action: submission.action,
                caster: submission.caster,
                target: submission.target
            };

            await this.onNewEvent(event);
        }

        const statusEvents = caster.getStatusEvents();

        for (let i = 0; i < statusEvents.length; i++) {
            const event = {
                ...statusEvents[i],
                // The caster of the current turn will be the target of its statuses.
                target: submission.caster 
            };

            await this.onNewEvent(event);
        }

        this.currentTeam = (this.currentTeam === "player") ? "enemy" : "player";
        this.turn();
    }
}
