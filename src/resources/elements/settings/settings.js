import { inject, bindable, BindingEngine } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';

@inject(BindingEngine, EventAggregator, SettingsService)
export class SettingsCustomElement {
    @bindable initial
    @bindable language;
    @bindable levelCompleted;
    @bindable level;
    @bindable maxLevel;

    constructor(bindingEngine, eventAggregator, settingsService) {
        this._bindingEngine = bindingEngine;
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this.languages = [{
            id: 'en',
            name: 'English'
        }, {
            id: 'nl',
            name: 'Dutch'
        }, {
            id: 'random',
            name: 'Random mode'
        }];
    }

    attached() {
        const savedLanguageId = this._settingsService.getSettings('lang') || 'en';
        this.selectedLanguage = this.languages.find(language => language.id === savedLanguageId);

        const savedLastLevel = this._settingsService.getSettings('level') || 0;
        this.level = Math.max(savedLastLevel, this.level);
    }

    detached() {
        this._languageChangedSubscription.dispose();
    }

    languageChanged(newValue) {
        if (newValue !== undefined) {
            this.language = newValue;
            this._settingsService.saveSettings('lang', this.language.id);
        }
    }

    levelChanged(level) {
        this._settingsService.saveSettings('level', level);
    }

    startGame() {
        this._eventAggregator.publish('startGame');
    }

    pauseGame() {
        !this.initial && this._eventAggregator.publish('pause', true);
    }

}
