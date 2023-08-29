import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class BlockCustomElement {
    @bindable block;
    @bindable piles;

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
        const columnCount = Math.floor(boardWidth / this.size);
        this.block.column = Math.floor(Math.random() * columnCount);
        this.piles[this.block.column]++;

        const margin = (boardWidth - (columnCount * this.size)) / 2;
        this.left = this.block.column * this.size + margin;

        const blocksInTargetPileCount = this.piles[this.block.column] - 1;
        const totalBlocksHeight = blocksInTargetPileCount * 5;
        const newHeight = 100 - totalBlocksHeight + 'dvh';
        this._element.style.setProperty("--pileTop", newHeight);

        this._$element.one('animationend', _ => {
            const targetPile = $('.pile--' + this.block.column)[0];
            this.block.missed = true;
            this._$element.children('div').appendTo(targetPile);
            this._eventAggregator.publish('remove', this.block.id);
        });

        this._$element.find('div').one('animationend', _ => this._eventAggregator.publish('remove', this.block.id));
    }

}
