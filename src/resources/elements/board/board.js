import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeyInputService } from 'services/key-input-service';

@inject(EventAggregator, KeyInputService)
export class BoardCustomElement {
    _title = 'TypeFall';

    constructor(eventAggregator, keyInputService) {
        this.title = this._title;
        this._eventAggregator = eventAggregator;
        this._keyInputService = keyInputService;
        this._letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this._addInterval = 1000;
        this._maxBlocks = 100;
        this.maxPiles = 19;
    }

    attached() {
        this._startGame();
        this._letterRemoveSubscription = this._eventAggregator.subscribe('remove', id => this._removeLetter(id));
        this._keyboardSubscription = this._eventAggregator.subscribe('key', key => this._checkTyped(key));
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => this._togglePause());
        $(window).on('resize', _ => {
            clearTimeout(this._restartTimeout);
            this._restartTimeout = setTimeout(_ => {
                this._pauseGame();
                this._startGame();
            }, 50);
        });
    }

    detached() {
        clearInterval(this._letterAdderInterval);
        this._letterRemoveInterval.dispose();
        this._keyboardSubscription.dispose();
        this._startStopSubscription.dispose();
    }

    _addRandomLetter() {
        if (this.blocks.length < this._maxBlocks) {
            const letter = this._letters[Math.floor(Math.random() * this._letters.length)];
            const randomBlock = {
                letter: letter,
                id: letter + performance.now(),
                typed: false,
                missed: false,

                itsMe: key => {
                    return key == randomBlock.letter;
                }
            }
            this.blocks.push(randomBlock);
        }

    }

    _checkTyped(key) {
        const index = this.blocks.findIndex(block => block.itsMe(key) && !block.missed);
        if (index !== -1) {
            const block = this.blocks[index];
            block.typed = true;
            this.pileHeights[block.column]--;
        } else {
            // document.querySelectorAll('block').forEach(block => block.classList.add('animation-fall-down'));
            document.querySelectorAll('block').forEach(block => block.style.setProperty('--animationDuration', '1s'));
        }

    }

    _removeLetter(id) {
        const index = this.blocks.findIndex(block => block.id == id);
        if (index !== -1) {
            this.blocks.splice(index, 1);
        }
    }

    _startGame() {
        this.blocks = [];
        this.pileHeights = [...new Array(this.maxPiles)].map(() => 0);
        $('.pile').children().remove();
        this._resumeGame();
    }

    _resumeGame() {
        this._letterAdderInterval = setInterval(_ => this._addRandomLetter(), this._addInterval);
        this.title = this._title;
    }

    _pauseGame() {
        clearInterval(this._letterAdderInterval);
        this._letterAdderInterval = undefined;
        this.title = 'Pause';
    }

    _togglePause() {
        this._letterAdderInterval ? this._pauseGame() : this._resumeGame();
    }

}
