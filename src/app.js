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
        this._startLevel = 1;
        this.level = this._startLevel;
        this.maxLevel = 5;
        this.levelCompleted = false;
        this.gameCompleted = false;
    }

    attached() {
        this._languageToggleSubscription = this._eventAggregator.subscribe('languageChanged', lang => {
            this.language = lang;
            this.level = this._startLevel;
            this.initial = true;
            this.paused = true;
        });
        // listens to events emitted by settings or key-input-service
        this._startStopSubscription = this._eventAggregator.subscribe('pause', isPaused => {
            if (this.initial || this.gameOver || this.gameCompleted) return;
            this.paused = isPaused;
        });
        this._startSubscription = this._eventAggregator.subscribe('startGame', _ => {
            if (!this.paused) return;
            if (this.gameCompleted) {
                this.level = this._startLevel;
            }
            this.paused = false;
        });
        // listen to gameStarted event
        this._gameStartedSubscription = this._eventAggregator.subscribe('gameStarted', _ => {
            this.gameOver = false;
            this.gameCompleted = false;
            this.levelCompleted = false;
            this.initial = false;
        })
        // listen to level change in settings
        this._setLevelSubscription = this._eventAggregator.subscribe('level', level => {
            this.level = level;
        });
        this._levelCompleteSubscription = this._eventAggregator.subscribe('levelComplete', _ => {
            if (this.level == this.maxLevel) {
                this.gameCompleted = true;
            } else {
                this.levelCompleted = true;
                this.level++;
            }
            this.paused = true;
        });
        this._gameOverSubscription = this._eventAggregator.subscribe('gameOver', _ => {
            this.gameOver = true;
            this.paused = true;
        });
        $(window).on('resize', _ => {
            if (this.initial) return;
            this.initial = true;
            this.paused = true;
        }).on('touchstart', _ => {
            this.isMobile = true;
        });
        // $('.blocks').on('click', _ => this._eventAggregator.publish('pause', this.initial || this.gameOver || !this.paused));
    }

    detached() {
        this._startStopSubscription.dispose();
        this._startSubscription.dispose();
        this._setLevelSubscription.dispose();
        this._levelCompleteSubscription.dispose();
        this._gameOverSubscription.dispose();
        this._gameStartedSubscription.dispose();
        this._languageToggleSubscription.dispose();
        $(window).off('resize');
        $('.blocks').off('click');
    }
}
