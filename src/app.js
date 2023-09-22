import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';
@inject(EventAggregator)
export class App {
    _TITLE = 'TypeFall';

    constructor(eventAggregator) {
        this.title = this._TITLE;
        this._eventAggregator = eventAggregator;
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => this._togglePause());
        this._pause = false;
    }

    _togglePause() {
        this.title = this._pause ? 'Pause' : this._TITLE;
        this._pause = !this._pause;
    }

}
