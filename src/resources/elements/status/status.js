import { inject, bindable } from 'aurelia-framework';

export class StatusCustomElement {
    @bindable paused
    @bindable initial
    @bindable gameOver
    @bindable isMobile
    constructor() {
        this.title = 'TypeFall';
    }
}
