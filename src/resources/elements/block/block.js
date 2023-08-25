import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class BlockCustomElement {
    @bindable block;

    constructor(element, eventAggregator) {
        this._element = element;
        this._eventAggregator = eventAggregator;
        this.fallDown = false;
        this._fallTime = .5; // seconds
    }

    attached() {
        this._initLetter();
    }

    // detached() {
    // }

    _initLetter() {
        const boardWidth = document.querySelectorAll('board')[0].clientWidth;
        const width = this._element.clientWidth;
        const cols = Math.floor(boardWidth / width);
        const randomCol = Math.floor(Math.random() * cols);
        this.left = randomCol * width;
    }

}
