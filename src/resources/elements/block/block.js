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
        const margin = (boardWidth - (cols * width)) / 2;
        this.block.column = Math.floor(Math.random() * cols);
        this.left = this.block.column * width + margin;
        this._$element.one('animationend', _ => this._pileBlock());
        this._$element.find('div').one('animationend', _ => this._eventAggregator.publish('remove', this.block.id));
    }

    _pileBlock() {
        this.block.missed = true;
        const targetColumn = $('.pile--' + this.block.column)[0];
        this._$element.children('div').appendTo(targetColumn);
        this._eventAggregator.publish('piled', this.block.column);

        // get variable from inline style
        const pileHeight = this._element.parentElement.style.getPropertyValue("--pileHeight");
        console.log(pileHeight);
        // // get variable from wherever
        // getComputedStyle(element).getPropertyValue("--my-var");

        // // set variable on inline style
        // element.style.setProperty("--my-var", jsVar + 4);
    }

}
