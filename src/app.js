import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeyInputService } from 'services/key-input-service';
import $ from 'jquery';

@inject(EventAggregator, KeyInputService)
export class App {
    _TITLE = 'TypeFall';

    constructor(eventAggregator, keyInputService) {
        this.title = this._TITLE;
        this._eventAggregator = eventAggregator;
        this._keyInputService = keyInputService;
        this._pause = false;
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => this._togglePause());
        this._startSubscription = this._eventAggregator.subscribe('startGame', _ => this._togglePause(false));
    }

    detached() {
        this._startStopSubscription.dispose();
    }

    _togglePause(value) {
        this._pause = value == false ? false : !this._pause;
        this.title = this._pause ? 'Pause' : this._TITLE;
    }
}
