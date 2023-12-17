import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';

@inject(EventAggregator, SettingsService)
export class ScoreCustomElement {
    @bindable gameOver;
    @bindable level;
    @bindable language;

    constructor(eventAggregator, settingsService) {
        this.score = 0;
        this.highScore = 0;
        this.randomMode = false;
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this._wordComplete = true;
        this._resetScore = false;
    }

    attached() {
        this.highScore = this._settingsService.getSettings('highScore') || 0;
        this._scoreSubscription = this._eventAggregator.subscribe('score', score => {
            if (this.gameOver) return;
            if (score == 1) this._wordComplete = false;

            if (score < 0) {
                this.negative = true;
                setTimeout(_ => {
                    this.negative = false;
                }, 400);
            }

            this.score = this._resetScore ? 0 : this.score;
            this._resetScore = false;

            if (score == 5) {
                this.score = this._wordComplete ? this.score + score : this.score;
                this._wordComplete = true;
            } else {
                this.score += score;
            }

            this._checkHighScore();
        });
    }

    detached() {
        this._scoreSubscription.dispose();
    }

    gameOverChanged(newValue) {
        this._resetScore = newValue;
    }

    languageChanged() {
        this.score = 0;
    }

    _checkHighScore() {
        this.highScore = this.score > this.highScore ? this.score : this.highScore;
        this._settingsService.saveSettings('highScore', this.highScore);
    }
}
