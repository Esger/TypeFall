import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class BlockCustomElement {
    @bindable letter;

    constructor(element, eventAggregator) {
        this._element = element;
        this._eventAggregator = eventAggregator;
        this.fallDown = false;
        this.onBoard = false;
        this._fallTime = .5; // seconds
    }

    attached() {
        this._initLetter();
        this._keyboardListener = this._eventAggregator.subscribe('key', key => this._checkMe(key));
    }

    detached() {
        this._keyboardListener.dispose();
    }

    _initLetter() {
        const boardWidth = document.querySelectorAll('board')[0].clientWidth;
        const width = this._element.clientWidth;
        const cols = Math.floor(boardWidth / width);
        const randomCol = Math.floor(Math.random() * cols);
        this._element.style.setProperty("--offsetX", randomCol * width + 'px');
        setTimeout(_ => {
            this.onBoard = true;
        }, this._fallTime + 's');
    }

    _checkMe(key) {
        if (!this.fallDown) {
            this.fallDown = key == this.letter.letter;
            setTimeout(_ => {
                this.letter.remove = true;
            }, this._fallTime + 's');
        }
    }
}
