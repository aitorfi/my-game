'use strict';

class TurnCycle {
    constructor(config) {
        this.battle = config.battle;
        this.onNewEvent = config.onNewEvent;
        this.currentTeam = "player";
    }

    async init() {
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

        if (submission.replacement) {
            await this.onNewEvent({
                type: utils.behaviorTypes.replacement,
                replacement: submission.replacement
            });

            await this.onNewEvent({
                type: utils.behaviorTypes.text,
                text: "{CASTER} was replaced by {TARGET}.",
                caster,
                target: submission.replacement
            });

            this.nextTurn();
            return;
        }

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

        const isTargetDead = submission.target.hp <= 0;

        if (isTargetDead) {
            await this.onNewEvent({
                type: utils.behaviorTypes.text,
                text: "{TARGET} died in combat.",
                target: submission.target
            });
        }

        const winnerTeam = this.getWinnerTeam();

        if (winnerTeam) {
            await this.onNewEvent({
                type: utils.behaviorTypes.text,
                text: "The battle finished!"
            });

            // TODO: Implement a return to the Overworld.
            return;
        }

        if (isTargetDead) {
            const replacement = await this.onNewEvent({
                type: utils.behaviorTypes.replacementMenu,
                team: submission.target.team
            });

            await this.onNewEvent({
                type: utils.behaviorTypes.replacement,
                replacement
            });

            await this.onNewEvent({
                type: utils.behaviorTypes.text,
                text: "{CASTER} was replaced by {TARGET}.",
                caster: submission.target,
                target: replacement
            });
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

        this.nextTurn();
    }

    nextTurn() {
        this.currentTeam = (this.currentTeam === "player") ? "enemy" : "player";
        this.turn();
    }

    getWinnerTeam() {
        let combatants = [];

        combatants["player"] = Object.values(this.battle.combatants).find((combatant) => {
            return (combatant.hp > 0 && combatant.team === "player");
        });

        combatants["enemy"] = Object.values(this.battle.combatants).find((combatant) => {
            return (combatant.hp > 0 && combatant.team === "enemy");
        });

        if (!combatants["player"]) 
            return "enemy";

        if (!combatants["enemy"])
            return "player";
            
        return null;
    }
}
