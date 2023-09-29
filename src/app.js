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
        this.gameState = {
            pause: true,
            initial: true
        }
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => {
            if (this.gameState.initial) return;
            this.gameState.pause = !this.gameState.pause;
        });
        this._startSubscription = this._eventAggregator.subscribe('startGame', _ => {
            this.gameState.pause = false;
            this.gameState.initial = false;
        });
    }

    detached() {
        this._startStopSubscription.dispose();
        this._startSubscription.dispose();
    }
}
