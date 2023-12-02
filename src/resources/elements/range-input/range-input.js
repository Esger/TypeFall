import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class RangeInputCustomElement {
    @bindable value;
    @bindable min = 0;
    @bindable max = 3;
    @bindable label;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    valueChanged(newValue) {
        this._eventAggregator.publish('level', newValue);
    }
}

