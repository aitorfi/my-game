'use strict';

class Combatant {
    constructor(config, battle) {
        this.name = config.name;
        this.description = config.description;
        this.type = config.type;
        this.src = config.src;
        this.icon = config.icon;
        this.actions = config.actions;

        this.hp = config.hp;
        this.maxHp = config.maxHp;
        this.xp = config.xp;
        this.maxXp = config.maxXp;
        this.maxXp = config.maxXp;
        this.level = config.level;
        this.team = config.team;
        this.status = config.status;
        this.isPlayerControlled = config.isPlayerControlled;

        this.battle = battle;

        this.hudElement = null;
        this.unitElement = null;
    }

    get hpPercent() {
        const percent = this.hp / this.maxHp * 100;
        return (percent > 0) ? percent : 0;
    }

    get xpPercent() {
        return this.xp / this.maxXp * 100;
    }

    get isActive() {
        return (this.battle.activeCombatants[this.team] === this.id);
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.unitElement);
        this.update();
    }

    createElement() {
        this.hudElement = document.createElement('div');
        this.hudElement.classList.add('Combatant');
        this.hudElement.setAttribute('data-combatant', this.id);
        this.hudElement.setAttribute('data-team', this.team);
        this.hudElement.innerHTML = `
            <p class="Combatant_name">${this.name}</p>
            <p class="Combatant_level">lvl. ${this.level}</p>
            <div class="Combatant_character_crop">
                <img class="Combatant_character" alt="${this.name}" src="${this.src}"/>
            </div>
            <img class="Combatant_type" src="${this.icon}" alt="${this.type}"/>
            <svg viewBox="0 0 26 3" class="Combatant_life_container">
                <rect x=0 y=0 width"0%" height=1 fill="#82FF71"/>
                <rect x=0 y=1 width"0%" height=2 fill="#3EF126"/>
            </svg>
            <svg viewBox="0 0 26 2" class="Combatant_xp_container">
                <rect x=0 y=0 width"0%" height=1 fill="#FFD76A"/>
                <rect x=0 y=1 width"0%" height=1 fill="#FFC936"/>
            </svg>
            <p class="Combatant_status"></p>
        `;

        this.unitElement = document.createElement('div');
        this.unitElement.classList.add('Unit_wrapper');
        this.unitElement.setAttribute('data-team', this.team);
        this.unitElement.innerHTML = `
            <img src="${this.src}" alt="${this.name}"/>
        `;

        this.hpBars = this.hudElement.querySelectorAll(".Combatant_life_container > rect");
        this.xpBars = this.hudElement.querySelectorAll(".Combatant_xp_container > rect");
    }

    update(changes = {}) {
        Object.keys(changes).forEach((key) => {
            this[key] = changes[key];
        });

        this.hudElement.setAttribute('data-active', this.isActive);
        this.unitElement.setAttribute('data-active', this.isActive);

        this.hpBars.forEach((bar) => bar.style.width = `${this.hpPercent}%`);
        this.xpBars.forEach((bar) => bar.style.width = `${this.xpPercent}%`);

        const statusElement = this.hudElement.querySelector('.Combatant_status');

        if (this.status) {
            statusElement.innerHTML = this.status.name;
            statusElement.style.display = "block";
        } else {
            statusElement.innerHTML = "";
            statusElement.style.display = "none";
        }
    }

    getStatusEvents() {
        if (this.status) {
            return this.status.getStatusEvents();
        }

        return [];
    }
}
