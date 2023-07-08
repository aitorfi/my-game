'use strict';

class Battle {
    constructor(config) {
        this.enemy = config.enemy;
        this.onComplete = config.onComplete;

        this.combatants = {};

        this.activeCombatants = {
            player: null,
            enemy: null
        }

        window.playerState.lineup.forEach((id) => {
            this.addCombatant(id, 'player', window.playerState.units[id]);
        });

        Object.keys(this.enemy.units).forEach((key) => {
            this.addCombatant(key, 'enemy', this.enemy.units[key]);
        });

        this.element = null;
        this.turnCycle = null;
    }

    addCombatant(id, team, config) {
        this.combatants[id] = new Combatant({
            ...window.Soldiers[config.unitId],
            ...config,
            team,
            isPlayerControlled: (team === 'player')
        }, this);

        this.activeCombatants[team] = this.activeCombatants[team] || id;
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
            },
            onBattleEnd: (winner) => {
                if (winner === 'player') {
                    const playerState = window.playerState;
                    Object.keys(playerState.units).forEach((key) => {
                        const playerStateUnit = playerState.units[key];
                        const combatant = this.combatants[key];

                        if (combatant) {
                            playerStateUnit.hp = combatant.hp;
                            playerStateUnit.maxHp = combatant.maxHp;
                            playerStateUnit.xp = combatant.xp;
                            playerStateUnit.maxXp = combatant.maxXp;
                            playerStateUnit.level = combatant.level;
                        }
                    });
                }

                this.element.remove();
                this.onComplete();
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
