import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class BoardCustomElement {

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this._letters = [' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this._addInterval = 1000;
        this._maxBlocks = 100;
        this._typedCount = 0;
        this._paused = true;
        this.maxPiles = 19;
        this.random = false;
        this._texts = {
            'nl': 'In de schemering van de tijd, waar dromen en werkelijkheid elkaar ontmoeten als oude vrienden, strekte het duistere mysterie van de nacht zich uit over de stad. Een stad diep doordrenkt met geheimen, verborgen achter de facade van schijnbare normaliteit. Hier begint ons verhaal, waarvan de hoofdrolspeler zijn weg baant door het doolhof van zijn eigen ziel, terwijl de schaduwen fluisteren en de maan haar bleke licht werpt op de verborgen waarheden die zich in de donkerste hoeken verschuilen. Dit is een verhaal van betovering en bedrog, van onverwachte ontmoetingen en vergeten herinneringen, een verhaal dat zich afspeelt in een wereld waar de grens tussen wat echt is en wat slechts een droom lijkt te vervagen, zoals de zachte afdruk van een verloren kus op de rand van de nacht.',
            'en': 'In the twilight of time, where dreams and reality intertwine like old friends, the enigmatic shroud of night stretched across the city. A city steeped in secrets, concealed beneath the veneer of apparent normalcy. Here, our tale commences, with its protagonist navigating the labyrinth of his own soul, as shadows whisper and the moon casts its pale light upon the hidden truths lurking in the darkest corners. This is a narrative of enchantment and deception, of chance encounters and forgotten memories, a tale set in a realm where the boundary between what is real and what appears to be but a dream blurs, much like the gentle imprint of a lost kiss on the edge of night.',
            'random': 'random'
        };
        this.nextCharIndex = 0;
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('startGame', _ => this._startGame());
        this._letterRemoveSubscription = this._eventAggregator.subscribe('remove', id => this._removeLetter(id));
        this._keyboardSubscription = this._eventAggregator.subscribe('key', key => this._checkTyped(key));
        this._startStopSubscription = this._eventAggregator.subscribe('pause', _ => this._togglePause());
        this._scoreSubscription = this._eventAggregator.subscribe('score', score => this._adjustGameSpeed(score));
        this._languageToggleSubscription = this._eventAggregator.subscribe('languageChanged', value => {
            this.random = value == 'random';
            this._text = this._texts[value];
        });
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
        this._startStopSubscription.dispose();
        this._letterRemoveInterval.dispose();
        this._keyboardSubscription.dispose();
        this._startStopSubscription.dispose();
        this._languageToggleSubscription.dispose();
    }

    _adjustGameSpeed(score) {
        this._typedCount += score;
        if (this._typedCount > 10) {
            this._addInterval = Math.max(this._addInterval * .95, 400);
            this._typedCount = 0;
            console.log(this._addInterval);
            this._pauseGame();
            this._resumeGame();
        }
    }

    _nextLetter() {
        if (this.blocks.length > this._maxBlocks) return;
        let letter;
        if (this.random) {
            letter = this._letters[Math.floor(Math.random() * this._letters.length)];
        } else {
            const nextChar = this._text.charAt(this.nextCharIndex).toLocaleLowerCase();
            letter = this._letters.includes(nextChar) ? nextChar : undefined;
            this.nextCharIndex = Math.round(this.nextCharIndex + 1, this._text.length);
            if (!letter) return;
        }
        const nextBlock = {
            letter: letter,
            id: letter + performance.now(),
            typed: false,
            missed: false,

            is: key => {
                return key == nextBlock.letter;
            }
        }
        this.blocks.push(nextBlock);
    }

    _checkTyped(key) {
        const index = this.blocks.findIndex(block => block.is(key) && !block.missed && !block.typed);
        if (index !== -1) {
            const block = this.blocks[index];
            block.typed = true;
            this.pileHeights[block.column]--;
        } else {
            const blocks = document.querySelectorAll('block');
            this._eventAggregator.publish('score', -blocks.length);
            blocks.forEach(block => block.style.setProperty('--animationDuration', '1s'));
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
        this._addInterval = 1000;
        this._paused && this._resumeGame();
    }

    _resumeGame() {
        clearInterval(this._letterAdderInterval);
        this._letterAdderInterval = setInterval(_ => this._nextLetter(), this._addInterval);
    }

    _pauseGame() {
        clearInterval(this._letterAdderInterval);
        this._letterAdderInterval = undefined;
        this._paused = true;
    }

    _togglePause() {
        this._letterAdderInterval ? this._pauseGame() : this._resumeGame();
    }

}
