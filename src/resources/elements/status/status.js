import { inject, bindable } from 'aurelia-framework';

export class StatusCustomElement {
    @bindable paused = true;
    @bindable level = 0;
    @bindable initial;
    @bindable gameOver;
    @bindable isMobile;

    constructor() {
        this.title = 'TypeFall';
        this.showLevel = false;
    }

    pausedChanged() {
        this.showLevel = false;
    }

    levelChanged(newLevel, oldLevel) {
        setTimeout(() => {
            this.showLevel = newLevel !== oldLevel;
        }, 1000);
    }
}
