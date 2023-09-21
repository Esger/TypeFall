import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class SettingsCustomElement {

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    randomToggle() {
        this._eventAggregator.publish('randomToggle', this.randomMode);
    }
}
