import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class BlockCustomElement {
    @bindable block;
    @bindable piles;
    @bindable isNextBlock;

    constructor(element, eventAggregator) {
        this._element = element;
        this._eventAggregator = eventAggregator;
        this.missed = false;
    }

    attached() {
        this._$element = $(this._element);
        this._initLetter();
        this._score = this.block.letter == ' ' ? 5 : 1;
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
            this._eventAggregator.publish('score', -1);
            this._eventAggregator.publish('remove', this.block.id);
            this._checkFullPile(targetPile);
        });

        this._$element.find('div').one('animationend', _ => {
            this._eventAggregator.publish('score', this.isNextBlock ? 2 * this._score : this._score);
            this._eventAggregator.publish('remove', this.block.id);
        });
    }

    _checkFullPile(pile) {
        const blocksInPile = $(pile).children().length;
        const allowedBlocksInPile = Math.floor(pile.clientHeight / this.size) - 2;
        const gameOver = blocksInPile > allowedBlocksInPile;
        gameOver && this._eventAggregator.publish('gameOver');
    }

}
