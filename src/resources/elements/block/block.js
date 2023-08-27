import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class BlockCustomElement {
    @bindable block;

    constructor(element, eventAggregator) {
        this._element = element;
        this._eventAggregator = eventAggregator;
        this.missed = false;
    }

    attached() {
        this._initLetter();
        $(this._element).one('animationend', _ => this.block.missed = true);
    }

    // detached() {
    // }

    _initLetter() {
        const width = this._element.clientWidth;
        const boardWidth = this._element.parentElement.clientWidth;
        const cols = Math.floor(boardWidth / width);
        const randomCol = Math.floor(Math.random() * cols);
        this.left = randomCol * width;
    }

}
