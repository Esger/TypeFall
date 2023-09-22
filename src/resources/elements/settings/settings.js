import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class SettingsCustomElement {

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.initial = true;
    }

    attached() {
        this._startGameSubscription = this._eventAggregator.subscribeOnce('startGame', _ => this.initial = false);
    }

    randomToggle() {
        this._eventAggregator.publish('randomToggle', this.randomMode);
    }

    startGame() {
        this._eventAggregator.publish('startGame');
    }
}
