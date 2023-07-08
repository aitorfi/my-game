'use strict'

class PlayerState {
    constructor() {
        this.units = {
            "p1": {
                unitId: "sword001",
                hp: 100,
                maxHp: 100,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null
            },
            "p2": {
                unitId: "spear001",
                hp: 100,
                maxHp: 100,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null
            }
        }

        this.lineup = ['p1', 'p2'];
    }
}

window.playerState = new PlayerState();
