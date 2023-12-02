import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class RangeInputCustomElement {
    @bindable value;
    @bindable min = 0;
    @bindable max = 3;
    @bindable label = 'label';

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    newValue() {
        this._eventAggregator.publish(this.label.toLowerCase() + '', this.value);
    }
}

