'use strict';

class SubmissionMenu {
    constructor(config) {
        this.caster = config.caster;
        this.target = config.target;
        this.replacements = config.replacements;
        this.onComplete = config.onComplete;

        this.keyBoardMenu = null;
    }

    init(container) {
        if (this.caster.isPlayerControlled) {
            this.showMenu(container);
        } else {
            this.decide();
        }
    }

    showMenu(container) {
        this.keyBoardMenu = new KeyBoardMenu();
        this.keyBoardMenu.init(container);
        this.keyBoardMenu.setOptions(this.getPages().root);
    }

    getPages() {
        const backOption = {
            label: "Go Back",
            description: "Return to the previous page.",
            handler: () => {
                this.keyBoardMenu.setOptions(this.getPages().root);
            }
        };

        return {
            root: [
                {
                    label: "Attack",
                    description: "Choose an attack.",
                    handler: () => {
                        this.keyBoardMenu.setOptions(this.getPages().attacks);
                    }
                },
                {
                    label: "Items",
                    description: "Choose an item.",
                    disabled: true, // Not implemented yet.
                    handler: () => {
                    }
                },
                {
                    label: "Swap",
                    description: "Swap to another combat unit.",
                    disabled: false,
                    handler: () => {
                        this.keyBoardMenu.setOptions(this.getPages().replacements);
                    }
                }
            ],
            attacks: [
                ...this.caster.actions.map((key) => {
                    const action = window.Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            this.menuSubmit(action);
                        }
                    };
                }),
                backOption
            ],
            replacements: [
                ...this.replacements.map(replacement => {
                    return {
                        label: replacement.name,
                        description: replacement.description,
                        handler: () => {
                            this.menuSubmitReplacement(replacement);
                        }
                    };
                }),
                backOption
            ]
        };
    }

    menuSubmitReplacement(replacement) {
        this.keyBoardMenu?.end();
        this.onComplete({ replacement });
    }

    menuSubmit(action) {
        this.keyBoardMenu?.end();
        
        this.onComplete({
            action,
            caster: this.caster,
            target: this.target
        });
    }

    decide() {
        this.menuSubmit(Actions[this.caster.actions[0]]);
    }
}
