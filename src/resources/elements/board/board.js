import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeyInputService } from 'services/key-input-service';

@inject(EventAggregator, KeyInputService)
export class BoardCustomElement {

    constructor(eventAggregator, keyInputService) {
        this._eventAggregator = eventAggregator;
        this._keyInputService = keyInputService;
        this._letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this._maxBlocks = 10;
        this.blocks = [];
        this._addInterval = 1000;
    }

    attached() {
        this._letterAdderInterval = setInterval(_ => this._addRandomLetter(), this._addInterval);
        this._letterRemoveInterval = setInterval(_ => this._removeTypedLetters(), this._addInterval * .9);
        this._keyboardListener = this._eventAggregator.subscribe('key', key => this._markBlockAsTyped(key));
    }

    detached() {
        clearInterval(this._letterAdderInterval);
        this._keyboardListener.dispose();
        this._letterRemoveInterval.dispose();
    }

    _addRandomLetter() {
        if (this.blocks.length < this._maxBlocks) {
            const letter = this._letters[Math.floor(Math.random() * this._letters.length)];
            const randomBlock = {
                letter: letter,
                id: letter + performance.now(),
                typed: false,

                itsMe: key => {
                    return key == randomBlock.letter;
                }
            }
            this.blocks.push(randomBlock);
        }
    }

    _markBlockAsTyped(key) {
        const index = this.blocks.findIndex(block => block.itsMe(key));
        if (index !== -1) {
            this.blocks[index].typed = true;
        }
    }

    _removeTypedLetters() {
        const index = this.blocks.findIndex(block => block.typed);
        if (index !== -1) {
            this.blocks.splice(index, 1);
        }
    }
}
