import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class RangeInputCustomElement {
    @bindable value;
    @bindable min = 1;
    @bindable max = 3;
    @bindable label = 'label';

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    newValue() {
        const inputName = this.label.toLowerCase();
        this._eventAggregator.publish(inputName, this.value);
    }
}

