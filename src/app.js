import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeyInputService } from 'services/key-input-service';
import $ from 'jquery';

@inject(EventAggregator, KeyInputService)
export class App {

    constructor(eventAggregator, keyInputService) {
        this._eventAggregator = eventAggregator;
        this._keyInputService = keyInputService;
        this.paused = false;
        this.initial = true;
        this.gameOver = false;
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => {
            if (this.initial || this.gameOver) return;
            this.paused = !this.paused;
        });
        this._startSubscription = this._eventAggregator.subscribe('startGame', _ => {
            this.paused = false;
            this.initial = false;
            this.gameOver = false;
        });
        this._gameOverSubscription = this._eventAggregator.subscribe('gameOver', _ => {
            this.gameOver = true;
            this.paused = true;
        });
        $(window).on('resize', _ => {
            clearTimeout(this._restartTimeout);
            this._restartTimeout = setTimeout(_ => {
                if (this.initial) return;
                this._eventAggregator.publish('pause');
                this._eventAggregator.publish('startGame');
            }, 50);
        })
        $('.blocks').on('click', _ => this.initial ? this._eventAggregator.publish('startGame') : this._eventAggregator.publish('pause'));
    }

    detached() {
        this._startStopSubscription.dispose();
        this._startSubscription.dispose();
        $(window).off('resize');
        $$('.blocks').off('click');
    }
}
