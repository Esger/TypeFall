import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class RadioSetCustomElement {
    @bindable name;
    @bindable options = []; // An array of option objects, e.g., [{ id: 'en', value: 'english' }, ...]
    @bindable selectedOption = null; // The selected option

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    selectedOptionChanged(newValue) {
        const eventName = newValue + 'Changed'; // #TODO 'eventName' gebruiken, gaat niet goed bij start
        this._eventAggregator.publish('languageChanged', newValue);
    }
}
