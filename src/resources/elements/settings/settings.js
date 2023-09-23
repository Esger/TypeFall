import { inject, observable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class SettingsCustomElement {
    @observable selectedLanguage;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
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
        this.selectedLanguage = this.languages[0];
    }

    attached() {
        this._startGameSubscription = this._eventAggregator.subscribeOnce('startGame', _ => this.initial = false);
        this._eventAggregator.publish('languageChanged', this.selectedLanguage.id);
    }

    startGame() {
        this._eventAggregator.publish('startGame');
    }

    selectedLanguageChanged(newValue) {
        this._eventAggregator.publish('languageChanged', newValue.id);
    }
}
