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
        this._scoreSubscription = this._eventAggregator.subscribe('score', score => {
            if (score < 0) {
                this.negative = true;
                setTimeout(_ => {
                    this.negative = false;
                }, 400);
            }
            this.score += score;
        });
        this._startGameSubscription = this._eventAggregator.subscribe('startGame', _ => { this.score = 0 });
    }

    detached() {
        this._scoreSubscription.dispose();
        this._startGameSubscription.dispose();
    }
}
