import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class SettingsCustomElement {

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.initial = true;
    }

    randomToggle() {
        this._eventAggregator.publish('randomToggle', this.randomMode);
    }

    startGame() {
        this._eventAggregator.publish('startGame');
        this.initial = false;
    }
}
