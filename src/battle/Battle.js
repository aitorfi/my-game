'use strict';

class Battle {
    constructor() {
        this.element = null;
        this.combatants = {
            "player1": new Combatant({
                ...window.Soldiers.sword001,
                team: "player",
                hp: 100,
                maxHp: 100,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null,
                isPlayerControlled: true
            }, this),
            "player2": new Combatant({
                ...window.Soldiers.spear001,
                team: "player",
                hp: 100,
                maxHp: 100,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null,
                isPlayerControlled: true
            }, this),
            "enemy1": new Combatant({
                ...window.Soldiers.spear001,
                team: "enemy",
                hp: 100,
                maxHp: 100,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
            "enemy2": new Combatant({
                ...window.Soldiers.bow001,
                team: "enemy",
                hp: 100,
                maxHp: 100,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null
            }, this)
        };

        this.activeCombatants = {
            player: "player1",
            enemy: "enemy1"
        }

        this.turnCycle = null;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        this.playerTeam = new Team('player', 'Hero');
        this.enemyTeam = new Team('enemy', 'Enemy');

        Object.keys(this.combatants).forEach((key) => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);

            if (combatant.team === 'player') {
                this.playerTeam.combatants.push(combatant);
            } else {
                this.enemyTeam.combatants.push(combatant);
            }
        });

        this.playerTeam.init(this.element);
        this.enemyTeam.init(this.element);

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: (event) => {
                return new Promise((resolve) => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                });
            }
        });

        this.turnCycle.init();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('Battle');
    }

    updateTeamComponents() {
        this.playerTeam.update();
        this.enemyTeam.update();
    }
}