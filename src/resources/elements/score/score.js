import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';

@inject(EventAggregator, SettingsService)
export class ScoreCustomElement {
    @bindable gameOver

    constructor(eventAggregator, settingsService) {
        this.score = 0;
        this.highScore = 0;
        this.randomMode = false;
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
    }

    attached() {
        this.highScore = this._settingsService.getSettings('highScore') || 0;
        this._scoreSubscription = this._eventAggregator.subscribe('score', score => {
            if (this.gameOver) return;
            if (score < 0) {
                this.negative = true;
                setTimeout(_ => {
                    this.negative = false;
                }, 400);
            }
            this.score += score;
            this._checkHighScore();
        });
        this._startGameSubscription = this._eventAggregator.subscribe('startGame', _ => { this.score = 0 });
    }

    detached() {
        this._scoreSubscription.dispose();
        this._startGameSubscription.dispose();
    }

    _checkHighScore() {
        this.highScore = this.score > this.highScore ? this.score : this.highScore;
        this._settingsService.saveSettings('highScore', this.highScore);
    }
}
