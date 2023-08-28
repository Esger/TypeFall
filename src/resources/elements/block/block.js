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
        this.size = this._element.clientWidth;
        const boardWidth = this._element.parentElement.clientWidth;
        const cols = Math.floor(boardWidth / this.size);
        const margin = (boardWidth - (cols * this.size)) / 2;
        this.block.column = Math.floor(Math.random() * cols);
        this.left = this.block.column * this.size + margin;

        const targetPile = $('.pile--' + this.block.column)[0];
        const blocksInTargetPileCount = $(targetPile).children().length;
        const newHeight = 100 - (5 * blocksInTargetPileCount) + 'dvh';
        this._element.style.setProperty("--pileTop", newHeight);

        this._$element.one('animationend', _ => {
            this.block.missed = true;
            this._$element.children('div').appendTo(targetPile);
        });

        this._$element.find('div').one('animationend', _ => this._eventAggregator.publish('remove', this.block.id));
    }

}
