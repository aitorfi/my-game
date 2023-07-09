'use strict';

class TurnCycle {
    constructor(config) {
        this.battle = config.battle;
        this.onNewEvent = config.onNewEvent;
        this.onBattleEnd = config.onBattleEnd;
        this.currentTeam = "player";
    }

    async init() {
        await this.onNewEvent({
            type: utils.behaviorTypes.text,
            text: "{CASTER} wants to battle you!",
            caster: this.battle.enemy
        });

        this.turn();
    }

    async turn() {
        const { caster, target } = this.getTurnActors();

        const submission = await this.onNewEvent({
            type: utils.behaviorTypes.submissionMenu,
            caster,
            target
        });

        if (submission.replacement) {
            await this.replaceCombatant(caster, submission.replacement);
            this.nextTurn();
            return;
        }

        await this.handleSubmissionEvents(submission);
        await this.handleDeadCombatant(target);
        // The caster of the current turn will be the target of its statuses.
        await this.handleCombatantStatusEvents(caster);
        // Check if the caster is dead after the status events.
        await this.handleDeadCombatant(caster);

        this.nextTurn();
    }

    getTurnActors() {
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];
        const targetId = this.battle.activeCombatants[(caster.team === "player") ? "enemy" : "player"];
        const target = this.battle.combatants[targetId];

        return { caster, target };
    }

    nextTurn() {
        this.currentTeam = (this.currentTeam === "player") ? "enemy" : "player";
        this.turn();
    }

    async replaceCombatant(currentCombatant, replacementCombatant) {
        await this.onNewEvent({
            type: utils.behaviorTypes.replacement,
            replacement: replacementCombatant
        });

        await this.onNewEvent({
            type: utils.behaviorTypes.text,
            text: "{CASTER} was replaced by {TARGET}.",
            caster: currentCombatant,
            target: replacementCombatant
        });
    }

    async handleSubmissionEvents({ caster, target, action }) {
        const resultingEvents = this.getEventsFromSubmittedAction(action);

        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                action,
                caster,
                target
            };

            await this.onNewEvent(event);
        }
    }

    getEventsFromSubmittedAction(action) {
        if (utils.flipCoin(action.accuracy)) {
            return action.success;
        }

        return action.fail;
    }

    async handleDeadCombatant(combatant) {
        const isTargetDead = combatant.hp <= 0;

        if (isTargetDead) {
            await this.onNewEvent({
                type: utils.behaviorTypes.text,
                text: "{TARGET} died in combat.",
                target: combatant
            });

            if (combatant.team === "enemy") {
                const targetCombatantId = this.battle.activeCombatants.player;
                const targetCombatant = this.battle.combatants[targetCombatantId];
                const xpAmount = combatant.givesXp;

                await this.giveXp(targetCombatant, xpAmount);
            }
        }

        const winnerTeam = this.getWinnerTeam();

        if (winnerTeam) {
            await this.handleWinnerTeam(winnerTeam);
            return;
        }

        if (isTargetDead) {
            await this.handleDeadCombatantReplacement(combatant);
        }
    }

    async giveXp(targetCombatant, xpAmount) {
        await this.onNewEvent({
            type: utils.behaviorTypes.text,
            text: `{TARGET} gained ${xpAmount} XP!`,
            target: targetCombatant
        });

        await this.onNewEvent({
            type: utils.behaviorTypes.giveXp,
            xpAmount,
            combatant: targetCombatant
        });
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

    async handleWinnerTeam(winnerTeam) {
        await this.onNewEvent({
            type: utils.behaviorTypes.text,
            text: "The battle finished!"
        });

        this.onBattleEnd(winnerTeam);
    }

    async handleDeadCombatantReplacement(deadCombatant) {
        const replacement = await this.onNewEvent({
            type: utils.behaviorTypes.replacementMenu,
            team: deadCombatant.team
        });

        await this.onNewEvent({
            type: utils.behaviorTypes.replacement,
            replacement
        });

        await this.onNewEvent({
            type: utils.behaviorTypes.text,
            text: "{CASTER} was replaced by {TARGET}.",
            caster: deadCombatant,
            target: replacement
        });
    }

    async handleCombatantStatusEvents(combatant) {
        const statusEvents = combatant.getStatusEvents();

        for (let i = 0; i < statusEvents.length; i++) {
            const event = {
                ...statusEvents[i],
                target: combatant
            };

            await this.onNewEvent(event);
        }
    }
}
