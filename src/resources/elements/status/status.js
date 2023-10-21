import { inject, bindable } from 'aurelia-framework';

export class StatusCustomElement {
    @bindable paused = true;
    @bindable level = 0;
    @bindable levelCompleted;
    @bindable initial;
    @bindable gameOver;
    @bindable isMobile;

    constructor() {
        this.title = 'TypeFall';
        this.showLevel = false;
    }

    levelCompletedChanged(value) {
        this.showLevel = value;
    }
}
