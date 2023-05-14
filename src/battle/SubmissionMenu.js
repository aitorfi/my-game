'use strict';

class SubmissionMenu {
    constructor(config) {
        this.caster = config.caster;
        this.target = config.target;
        this.onComplete = config.onComplete;
    }

    init(container) {
        this.decide();
    }

    decide() {
        this.onComplete({
            caster: this.caster,
            action: Actions[this.caster.actions[0]],
            target: this.target
        });
    }
}
