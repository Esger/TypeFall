import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class BlockCustomElement {
    @bindable block;

    constructor(element, eventAggregator) {
        this._element = element;
        this._eventAggregator = eventAggregator;
    }

    attached() {
        this._initLetter();
        this._keyboardListener = this._eventAggregator.subscribe('key', key => this._check(key));
    }

    detached() {
        this._keyboardListener.dispose();
    }

    _check(key) {
        if (key === this.block.letter) {
            this.block.typed = true;
        }
    }

    _initLetter() {
        const boardWidth = document.querySelectorAll('board')[0].clientWidth;
        const width = this._element.clientWidth;
        const cols = Math.floor(boardWidth / width);
        const randomCol = Math.floor(Math.random() * cols);
        this.left = randomCol * width;
    }

}
