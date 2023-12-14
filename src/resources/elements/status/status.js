import { inject, bindable } from 'aurelia-framework';

export class StatusCustomElement {
    @bindable paused = true;
    @bindable level;
    @bindable levelCompleted;
    @bindable initial;
    @bindable gameOver;
    @bindable gameCompleted;
    @bindable isMobile;

    constructor() {
        this.title = 'TypeFall';
    }

}
