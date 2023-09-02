import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class ScoreCustomElement {
    constructor(eventAggregator) {
        this.score = 0;
        this._eventAggregator = eventAggregator;
    }

    attached() {
        this._scoreListener = this._eventAggregator.subscribe('score', score => {
            this.score += score;
        });
    }

    detached() {
        this._scoreListener.dispose();
    }

    valueChanged(newValue, oldValue) {
        // score flasht of zo
    }
}
