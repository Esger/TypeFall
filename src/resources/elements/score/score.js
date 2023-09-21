import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class ScoreCustomElement {

    constructor(eventAggregator) {
        this.score = 0;
        this.randomMode = false;
        this._eventAggregator = eventAggregator;
    }

    attached() {
        this._scoreListener = this._eventAggregator.subscribe('score', score => {
            if (score < 0) {
                this.negative = true;
                setTimeout(_ => {
                    this.negative = false;
                }, 400);
            }
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
