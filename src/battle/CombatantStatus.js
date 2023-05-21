'use strict';

class CombatantStatus {
    constructor({ name, expiresIn, combatant }) {
        this.name = name;
        this.status = Statuses[this.name];
        this.expiresIn = expiresIn || this.status.expiresIn;
        this.combatant = combatant;
    }

    getStatusEvents() {
        let events = [];

        events = this.status.successEvents;
        events = events.concat(this.decrementStatus());
        
        return events;
    }

    decrementStatus() {
        this.expiresIn--;

        if (this.expiresIn !== 0) {
            return [];
        }

        const events = this.status.expirationEvents || [];

        this.combatant.update({
            status: null
        });
        
        return events;
    }
}
