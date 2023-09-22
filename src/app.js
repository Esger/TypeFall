import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeyInputService } from 'services/key-input-service';
import $ from 'jquery';

@inject(EventAggregator, KeyInputService)
export class App {

    constructor(eventAggregator, keyInputService) {
        this.title = 'TypeFall';
        this._eventAggregator = eventAggregator;
        this._keyInputService = keyInputService;
        this.pause = false;
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => this._togglePause());
        this._startSubscription = this._eventAggregator.subscribe('startGame', _ => this._togglePause(false));
    }

    detached() {
        this._startStopSubscription.dispose();
    }

    _togglePause(value) {
        this.pause = value === false ? false : !this.pause;
    }
}
