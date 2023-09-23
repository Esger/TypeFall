import { inject, observable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';
@inject(EventAggregator, SettingsService)
export class SettingsCustomElement {
    @observable selectedLanguage;

    constructor(eventAggregator, settingsService) {
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this.initial = true;
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
        const savedLanguage = this._settingsService.getSettings('lang')?.id || 'en';
        this.selectedLanguage = this.languages.find(lang => lang.id === savedLanguage);
        this._startGameSubscription = this._eventAggregator.subscribeOnce('startGame', _ => this.initial = false);
        this._eventAggregator.publish('languageChanged', this.selectedLanguage.id);
    }

    startGame() {
        this._eventAggregator.publish('startGame');
    }

    selectedLanguageChanged(newValue) {
        this._eventAggregator.publish('languageChanged', newValue.id);
        this._settingsService.saveSettings('lang', newValue);
    }
}
