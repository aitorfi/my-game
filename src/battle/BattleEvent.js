'use strict';

class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;
    }

    init(resolve) {
        switch (this.event.type) {
            case utils.behaviorTypes.text:
                this.textMessage(resolve);
                break;

            case utils.behaviorTypes.submissionMenu:
                this.submissionMenu(resolve);
                break;

            case utils.behaviorTypes.stateChange:
                this.stateChange(resolve);
                break;

            case utils.behaviorTypes.battleAnimation:
                this.battleAnimation(resolve);
                break;

            case utils.behaviorTypes.replacement:
                this.replace(resolve);
                break;

            case utils.behaviorTypes.replacementMenu:
                this.replacementMenu(resolve);
                break;

            case utils.behaviorTypes.giveXp:
                this.giveXp(resolve);
                break;
        }
    }

    textMessage(resolve) {
        const text = this.event.text
            .replace("{CASTER}", this.event.caster?.name)
            .replace("{TARGET}", this.event.target?.name)
            .replace("{ACTION}", this.event.action?.name);

        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        });

        message.init(this.battle.element);
    }

    submissionMenu(resolve) {
        const {caster, target} = this.event;

        const menu = new SubmissionMenu({
            caster,
            target,
            replacements: Object.values(this.battle.combatants).filter((combatant) => {
                return (combatant.id !== caster.id && 
                        combatant.team === caster.team &&
                        combatant.hp > 0);
            }),
            onComplete: (submission) => {
                resolve(submission);
            }
        });

        menu.init(this.battle.element);
    }

    async stateChange(resolve) {
        const stateUpdate = new CombatantStateUpdate({
            combatant: this.event.target,
            state: this.event.state,
            battle: this.battle
        });

        switch (this.event.state.type) {
            case utils.battleStateChangeTypes.damage:
                await stateUpdate.doDamage();
                break;

            case utils.battleStateChangeTypes.status:
                await stateUpdate.applyStatus();
                break;
        }

        this.battle.updateTeamComponents();

        resolve();
    }

    battleAnimation(resolve) {
        const battleAnimation = new BattleAnimation({
            caster: this.event.caster,
            animation: this.event.animation,
            onComplete: () => {
                resolve();
            }
        });

        battleAnimation.init();
    }

    async replace(resolve) {
        const { replacement } = this.event;

        const previousCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
        this.battle.activeCombatants[replacement.team] = null;
        previousCombatant.update();
        await utils.wait(400);

        this.battle.activeCombatants[replacement.team] = replacement.id;
        replacement.update();
        await utils.wait(400);

        resolve();
    }

    replacementMenu(resolve) {
        const menu = new ReplacementMenu({
            replacements: Object.values(this.battle.combatants).filter((combatant) => {
                return (combatant.team === this.event.team && combatant.hp > 0);
            }),
            onComplete: (replacement) => {
                resolve(replacement);
            }
        });

        menu.init(this.battle.element);
    }

    giveXp(resolve) {
        let xpAmountToGive = this.event.xpAmount;
        const combatant = this.event.combatant;

        const step = () => {
            if (xpAmountToGive > 0) {
                xpAmountToGive -= 1;
                combatant.xp += 1;

                if (combatant.xp === combatant.maxXp) {
                    combatant.level += 1;
                    combatant.xp = 0;
                    // Each level requires 20% more xp to level up.
                    combatant.maxXp += combatant.maxXp * 0.20;
                }

                combatant.update();
                requestAnimationFrame(step);
                return;
            }

            resolve();
        }

        requestAnimationFrame(step);
    }
}
