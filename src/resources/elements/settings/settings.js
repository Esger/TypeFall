import { inject, bindable, BindingEngine } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';

@inject(BindingEngine, EventAggregator, SettingsService)
export class SettingsCustomElement {
    @bindable initial
    @bindable selectedLanguage;
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
        const savedLastLevel = this._settingsService.getSettings('level') || 0;
        if (savedLastLevel > this.level) {
            this.level = savedLastLevel;
            this._eventAggregator.publish('level', this.level);
        }
        this.selectedLanguage = this.languages.find(language => language.id === savedLanguageId);
        this._eventAggregator.publish('languageChanged', this.selectedLanguage);
        setTimeout(() => {
            this._languageChangedSubscription = this._eventAggregator.subscribe('languageChanged', language => this.selectedLanguageChanged(language));
        }, 100);
    }

    detached() {
        this._languageChangedSubscription.dispose();
    }

    selectedLanguageChanged(newValue) {
        this.selectedLanguage = newValue;
        this._settingsService.saveSettings('lang', this.selectedLanguage.id);
    }

    levelChanged(newValue) {
        this._lastLevel = newValue;
        this._settingsService.saveSettings('level', newValue);
        console.log(newValue);
    }

    startGame() {
        this._eventAggregator.publish('startGame');
    }

    pauseGame() {
        !this.initial && this._eventAggregator.publish('pause', true);
    }

}
