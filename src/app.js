import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeyInputService } from 'services/key-input-service';
import $ from 'jquery';

@inject(EventAggregator, KeyInputService)
export class App {

    constructor(eventAggregator, keyInputService) {
        this._eventAggregator = eventAggregator;
        this._keyInputService = keyInputService;
        this.paused = true;
        this.initial = true;
        this.gameOver = false;
        this.isMobile = false;
        this.level = 0;
        this.maxLevel = 5;
        this.levelCompleted = false;
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('pause', isPaused => {
            if (this.initial || this.gameOver) return;
            this.paused = isPaused;
        });
        this._startSubscription = this._eventAggregator.subscribe('startGame', _ => {
            if (!this.paused) return;
            this.paused = false;
            this.levelCompleted = false;
            setTimeout(_ => {
                this.initial = false;
                this.gameOver = false;
            });
        });
        this._setLevelSubscription = this._eventAggregator.subscribe('level', level => {
            this.levelCompleted = false;
            this.gameOver = false;
            this.level = level;
            if (level > 0) {
                this.initial = false;
            }
        });
        this._levelCompleteSubscription = this._eventAggregator.subscribe('levelComplete', _ => {
            this.level = Math.min(this.level + 1, this.maxLevel);
            this.levelCompleted = true;
            this.paused = true;
        });
        this._gameOverSubscription = this._eventAggregator.subscribe('gameOver', _ => {
            this.gameOver = true;
            this.paused = true;
        });
        $(window).on('resize', _ => {
            if (this.initial) return;
            this.initial = true;
            this._eventAggregator.publish('pause', true);
        }).on('touchstart', _ => {
            this.isMobile = true;
        });
        $('.blocks').on('click', _ => this._eventAggregator.publish('pause', this.initial || this.gameOver || !this.paused));
    }

    detached() {
        this._startStopSubscription.dispose();
        this._startSubscription.dispose();
        this._levelUpSubscription.dispose();
        this._levelCompleteSubscription.dispose();
        this._gameOverSubscription.dispose();
        $(window).off('resize');
        $('.blocks').off('click');
    }
}
