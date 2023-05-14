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
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            target: this.event.target,
            onComplete: (submission) => {
                resolve(submission);
            }
        });

        menu.init(this.battle.element);
    }

    async stateChange(resolve) {
        const {caster, target, damage} = this.event;

        if (damage) {
            target.update({
                hp: target.hp - damage
            });

            target.unitElement.classList.add('battle-damage-blink');
        }

        await utils.wait(600);

        target.unitElement.classList.remove('battle-damage-blink');
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
}
