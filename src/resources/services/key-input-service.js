import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class KeyInputService {

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        document.addEventListener('keydown', event => {
            this.handleKeyInput(event);
        });
    }

    handleKeyInput(event) {
        const key = event.code.toLowerCase()
        if (key.startsWith('key')) {
            const letter = key.slice(-1);
            this._eventAggregator.publish('key', letter);
        }
        if (key === 'escape') {
            this._eventAggregator.publish('pause');
        }

        // switch (event.code) {
        //     case 'ArrowLeft':
        //         this._eventAggregator.publish('moveKeyPressed', 'left');
        //         break;
        //     case 'ArrowUp':
        //         this._eventAggregator.publish('moveKeyPressed', 'up');
        //         break;
        //     case 'ArrowRight':
        //         this._eventAggregator.publish('moveKeyPressed', 'right');
        //         break;
        //     case 'ArrowDown':
        //         this._eventAggregator.publish('moveKeyPressed', 'down');
        //         break;
        //     case 'Enter':
        //         this._eventAggregator.publish('start');
        //         break;
        //     case 'Space':
        //         this._eventAggregator.publish('start');
        //         break;
        //     case 'Escape':
        //         this._eventAggregator.publish('giveUp');
        //         break;
        //     default:
        //         this._eventAggregator.publish('KeyPressed', 'somekey');
        // }
        return true;
    }

}
