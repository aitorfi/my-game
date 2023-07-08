'use strict';

class CombatantStateUpdate {
    constructor({ combatant, state, battle }) {
        this.combatant = combatant;
        this.state = state;
        this.battle = battle;
    }

    async doDamage() {
        if (this.combatant.hp <= 0) {
            return;
        }

        switch (this.state.unit) {
            case utils.battleDamageUnits.hp:
                this.combatant.update({
                    hp: this.combatant.hp - this.state.damage
                });

                break;

            case utils.battleDamageUnits.percentage:
                const damage = this.combatant.maxHp * this.state.damage;
                this.combatant.update({
                    hp: this.combatant.hp - damage
                });

                break;
        }

        this.combatant.unitElement.classList.add('battle-damage-blink');
        await utils.wait(600);
        this.combatant.unitElement.classList.remove('battle-damage-blink');
    }

    async applyStatus() {
        if (this.combatant.hp <= 0 || !utils.flipCoin(this.state.chance)) {
            return;
        }

        const status = this.state.status;

        this.combatant.update({
            status: new CombatantStatus({
                name: status.name,
                expiresIn: status.expiresIn,
                combatant: this.combatant
            })
        });

        for (let i = 0; i < status.applicationEvents.length; i++) {
            const event = {
                ...status.applicationEvents[i],
                action: status,
                target: this.combatant
            };

            await new Promise((resolve) => {
                const battleEvent = new BattleEvent(event, this.battle);
                battleEvent.init(resolve);
            });
        }
    }
}
