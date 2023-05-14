'use strict';

window.WeaponType = {
    sword: "sword",
    bow: "bow",
    spear: "spear"
}

window.Soldiers = {
    "sword001": {
        name: "Sword 001",
        type: WeaponType.sword,
        src: "../../img/people/battle-sword.png",
        icon: "../../img/icons/sword.png",
        actions: ["damage1"]
    },
    "bow001": {
        name: "Bow 001",
        type: WeaponType.bow,
        src: "../../img/people/battle-bow.png",
        icon: "../../img/icons/arrow.png",
        actions: ["damage1"]
    },
    "spear001": {
        name: "Spear 001",
        type: WeaponType.spear,
        src: "../../img/people/battle-spear.png",
        icon: "../../img/icons/spear.png",
        actions: ["damage1"]
    }
}
