import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class KeyInputService {

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        document.addEventListener('keydown', event => {
            if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return; // Niet reageren op command-, ctrl- en shift-key
            event.preventDefault(); // spatie moet laatst geklikte button niet triggeren.
            this.handleKeyInput(event);
        }, { passive: false });
    }

    handleKeyInput(event) {
        const key = event.code.toLowerCase()

        switch (key) {
            case 'enter':
                this._eventAggregator.publish('startGame');
                break;
            case 'escape':
                this._eventAggregator.publish('pause');
                break;
            case 'space':
                this._eventAggregator.publish('key', ' ');
                break;
            default:
                if (key.startsWith('key')) {
                    const letter = key.slice(-1);
                    this._eventAggregator.publish('key', letter);
                }
                break;
        }
        return true;
    }

}
