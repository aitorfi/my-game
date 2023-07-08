'use strict';

class ReplacementMenu {
    constructor(config) {
        this.replacements = config.replacements;
        this.onComplete = config.onComplete;

        this.keyboardMenu = null
    }

    init(container) {
        if (this.replacements[0].isPlayerControlled) {
            this.showMenu(container);
        } else {
            this.decide();
        }
    }

    showMenu(container) {
        this.keyboardMenu = new KeyBoardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions(this.replacements.map((replacement) => {
            return {
                label: replacement.name,
                description: replacement.description,
                handler: () => {
                    this.menuSubmit(replacement);
                }
            };
        }));
    }

    menuSubmit(replacement) {
        this.keyboardMenu?.end();
        this.onComplete(replacement);
    }

    decide() {
        this.menuSubmit(this.replacements[0]);
    }
}
