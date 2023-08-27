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
        this._$element = $(this._element);
        this._initLetter();
    }

    _initLetter() {
        const width = this._element.clientWidth;
        const boardWidth = this._element.parentElement.clientWidth;
        const cols = Math.floor(boardWidth / width);
        this.block.column = Math.floor(Math.random() * cols);
        this.left = this.block.column * width;
        this._$element.one('animationend', _ => this.block.missed = true);
        this._$element.find('div').one('animationend', _ => this._eventAggregator.publish('remove', this.block.id));
    }

}
