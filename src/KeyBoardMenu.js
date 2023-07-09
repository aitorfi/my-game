'use strict';

class KeyBoardMenu {
    constructor() {
        this.prevFocus = null;
        this.upKeyPressListener = null;
        this.downKeyPressListener = null;
        this.buttonAKeyPressListener = null;

        this.element = null;
        this.descriptionElement = null;
        this.descriptionElementText = null;
        this.options = null;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.descriptionElement);
        container.appendChild(this.element);

        this.upKeyPressListener = new KeyPressListener('ArrowUp', () => {
            const currentButtonIndex = Number(this.prevFocus.getAttribute('data-button'));
            const prevButton = Array.from(this.element.querySelectorAll('button[data-button]'))
                .reverse()
                .find((button) => {
                    return button.dataset.button < currentButtonIndex && !button.disabled;
                });

            prevButton?.focus();
        });

        this.downKeyPressListener = new KeyPressListener('ArrowDown', () => {
            const currentButtonIndex = Number(this.prevFocus.getAttribute('data-button'));
            const prevButton = Array.from(this.element.querySelectorAll('button[data-button]'))
                .find((button) => {
                    return button.dataset.button > currentButtonIndex && !button.disabled;
                });

            prevButton?.focus();
        });

        this.buttonAKeyPressListener = new KeyPressListener(utils.controls.buttonA, () => {
            this.prevFocus?.click();
        });
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('KeyBoardMenu');

        this.descriptionElement = document.createElement('div');
        this.descriptionElement.classList.add('DescriptionBox');
        this.descriptionElement.innerHTML = `<p></p>`;
        this.descriptionElementText = this.descriptionElement.querySelector('p');
    }

    setOptions(options) {
        this.options = options;
        this.element.innerHTML = this.options.map((option, index) => {
            const disabledAttr = (option.disabled) ? 'disabled' : '';

            return `
                <div class="option">
                    <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
                        ${option.label}
                    </button>
                </div>
            `;
        }).join("");

        this.element.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
                const chosenOption = this.options[Number(button.dataset.button)];
                chosenOption.handler();
            });

            button.addEventListener('mouseenter', () => {
                button.focus();
            });

            button.addEventListener('focus', () => {
                this.prevFocus = button;
                this.descriptionElementText.innerText = button.dataset.description;
            });
        });

        setTimeout(() => {
            this.element.querySelector("button[data-button]:not([disabled])").focus();
        }, 10);
    }

    end() {
        this.element.remove();
        this.descriptionElement.remove();
        this.upKeyPressListener.unbind();
        this.downKeyPressListener.unbind();
    }
}
