'use strict';

class BattleAnimation {
    constructor({ caster, animation, onComplete }) {
        this.caster = caster;
        this.animation = animation;
        this.onComplete = onComplete;
        
        this.element = this.caster.unitElement;
        this.battleAnimationClass = "";
        this.dashAnimationClass = "";
    }

    init() {
        switch (this.animation) {
            case utils.battleAnimations.slash:
                this.slash();
                break;

            case utils.battleAnimations.stab:
                this.stab();
                break;

            case utils.battleAnimations.shoot:
                this.shoot();
                break;
        }
    }

    async slash() {
        if (this.caster.team === 'player') {
            this.dashAnimationClass = 'battle-dash-left';
            this.animationClassName = 'battle-slash-left';
        } else {
            this.dashAnimationClass = 'battle-dash-right';
            this.animationClassName = 'battle-slash-right';
        }

        this.element.classList.add(this.dashAnimationClass);
        this.element.classList.add(this.animationClassName);

        const onAnimationEnd = (event) => {
            if (event.target !== this.element) {
                return;
            }

            this.element.classList.remove(this.dashAnimationClass);
            this.element.classList.remove(this.animationClassName);
            this.element.removeEventListener("animationend", onAnimationEnd);
        }

        this.element.addEventListener("animationend", onAnimationEnd);
        await utils.wait(150);
        this.onComplete();
    }

    async stab() {
        if (this.caster.team === 'player') {
            this.dashAnimationClass = 'battle-dash-left';
            this.animationClassName = 'battle-stab-left';
        } else {
            this.dashAnimationClass = 'battle-dash-right';
            this.animationClassName = 'battle-stab-right';
        }

        this.element.classList.add(this.dashAnimationClass);
        this.element.classList.add(this.animationClassName);

        const onAnimationEnd = (event) => {
            if (event.target !== this.element) {
                return;
            }

            this.element.classList.remove(this.dashAnimationClass);
            this.element.classList.remove(this.animationClassName);
            this.element.removeEventListener("animationend", onAnimationEnd);
        }

        this.element.addEventListener("animationend", onAnimationEnd);
        await utils.wait(150);
        this.onComplete();
    }

    async shoot() {
        if (this.caster.team === 'player') {
            this.animationClassName = 'battle-shoot-left';
        } else {
            this.animationClassName = 'battle-shoot-right';
        }

        this.element.classList.add(this.animationClassName);

        const onAnimationEnd = (event) => {
            if (event.target !== this.element.querySelector('img')) {
                return;
            }

            this.element.classList.remove(this.animationClassName);
            this.element.removeEventListener("animationend", onAnimationEnd);
        }

        this.element.addEventListener("animationend", onAnimationEnd);
        await utils.wait(150);
        this.onComplete();
    }
}
