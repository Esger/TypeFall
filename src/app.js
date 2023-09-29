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
        this.paused = false;
        this.initial = true;
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => {
            if (this.initial) return;
            this.paused = !this.paused;
        });
        this._startSubscription = this._eventAggregator.subscribe('startGame', _ => {
            this.paused = false;
            this.initial = false;
        });
        $(window).on('resize', _ => {
            clearTimeout(this._restartTimeout);
            this._restartTimeout = setTimeout(_ => {
                if (this.initial) return;
                this._eventAggregator.publish('pause');
                this._eventAggregator.publish('startGame');
            }, 50);
        });
    }

    detached() {
        this._startStopSubscription.dispose();
        this._startSubscription.dispose();
    }
}
