import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class BoardCustomElement {
    @bindable paused = true;
    @bindable level;
    @bindable language;
    @bindable levelCompleted;
    @bindable gameOver;
    @bindable gameCompleted;
    @bindable initial;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this._letters = [' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this._initialInterval = 1000; //1000;
        this._maxBlocks = 100;
        this._lettersPerLevel = 50;
        this._typedCount = 0;
        this.maxPiles = 19;
        this._random = false;
        this._texts = {
            'nl': 'In de schemering van de tijd, waar dromen en werkelijkheid elkaar ontmoeten als oude vrienden, strekte het duistere mysterie van de nacht zich uit over de stad. Een stad diep doordrenkt met geheimen, verborgen achter de facade van schijnbare normaliteit. Hier begint ons verhaal, waarvan de hoofdrolspeler zijn weg baant door het doolhof van zijn eigen ziel, terwijl de schaduwen fluisteren en de maan haar bleke licht werpt op de verborgen waarheden die zich in de donkerste hoeken verschuilen. Dit is een verhaal van betovering en bedrog, van onverwachte ontmoetingen en vergeten herinneringen, een verhaal dat zich afspeelt in een wereld waar de grens tussen wat echt is en wat slechts een droom lijkt te vervagen, zoals de zachte afdruk van een verloren kus op de rand van de nacht.',
            'en': 'In the twilight of time, where dreams and reality intertwine like old friends, the enigmatic shroud of night stretched across the city. A city steeped in secrets, concealed beneath the veneer of apparent normalcy. Here, our tale commences, with its protagonist navigating the labyrinth of his own soul, as shadows whisper and the moon casts its pale light upon the hidden truths lurking in the darkest corners. This is a narrative of enchantment and deception, of chance encounters and forgotten memories, a tale set in a realm where the boundary between what is real and what appears to be but a dream blurs, much like the gentle imprint of a lost kiss on the edge of night.',
            'random': this._letters.join('')
        };
        this._allowedCharSets = [
            'asdfjkl', ' eruio', 'ghtyvb', 'qwert', 'zxcvnm', '.,;/-', '?!:', '1234567890'
        ]
        this._nextCharIndex = 0;
    }

    attached() {
        this._letterRemoveSubscription = this._eventAggregator.subscribe('remove', id => this._removeLetter(id));
        this._keyboardSubscription = this._eventAggregator.subscribe('key', key => this._checkTyped(key));
        this._scoreSubscription = this._eventAggregator.subscribe('score', score => this._adjustGameSpeed(score));
    }

    detached() {
        clearInterval(this._letterAdderIntervalId);
        this._startStopSubscription.dispose();
        this._letterRemoveInterval?.dispose();
        this._keyboardSubscription?.dispose();
        this._pauseSubscription.dispose();
    }

    pausedChanged(paused) {
        if (paused) {
            this._pauseGame();
        } else {
            if (this.initial || this.gameOver || this.gameCompleted || this.levelCompleted) {
                this._startGame();
            } else {
                this._resumeGame();
            }
        }
    }

    languageChanged(lang) {
        if (!lang) return;
        this._random = lang.id == 'random';
        this._languageId = lang.id;
    }

    levelChanged() {
        this._nextCharIndex = 0;
    }

    gameOverChanged(gameOver) {
        gameOver && this._dropAllBlocks();
    }

    _adjustGameSpeed(score) {
        this._typedCount += score;
        if (this._typedCount > 10) {
            this._addInterval = Math.max(this._addInterval * .95, 400);
            this._typedCount = 0;
            this._pauseGame();
            this._resumeGame();
        }
    }

    _shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    _getLettersForCurrentLevel() {
        // early exit if no language selected
        if (!this._languageId) return;

        // get text for language
        let allowedText = this._texts[this._languageId];
        let allowedTextArray = allowedText.split('');

        // get string of allowed characters for level
        const lastSlice = Math.min(this.level, this._allowedCharSets.length - 1);
        let allowedCharacters = this._allowedCharSets.slice(0, lastSlice).join('');

        // filter out characters that are not meant for this level
        const inAllowedCharacters = char => allowedCharacters.includes(char.toLocaleLowerCase());
        allowedText = allowedTextArray.filter(char => inAllowedCharacters(char)).join('');

        // each subsequent level is 50 characters longer
        this._levelCharCount = this.level * this._lettersPerLevel;

        // duplicate random text till long enough and shuffle
        if (this._random) {
            while (allowedText.length < this._levelCharCount) {
                allowedText = allowedText + allowedText;
            }
            allowedText = this._shuffleArray(allowedText.split('')).join('');
        }

        // truncate to level length
        allowedText = allowedText.substring(0, this._levelCharCount);
        return allowedText;
    }

    _nextLetter() {
        if (this.paused || this.gameCompleted || !this._text || this.blocks?.length > this._maxBlocks) return false;

        let letter;
        if (this._nextCharIndex > this._levelCharCount) {
            return false;
        } else {
            letter = this._text.charAt(this._nextCharIndex).toLocaleLowerCase();
            this._nextCharIndex++;
        }

        if (!letter) return false;

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
        return true;
    }

    _levelComplete() {
        if (this.paused) return false;
        this._blocksEmptyPollTimer = setInterval(_ => {
            if (this.blocks.length == 0) {
                clearInterval(this._blocksEmptyPollTimer);
                this._eventAggregator.publish('levelComplete');
            }
        }, 500);
    }

    _checkTyped(key) {
        if (!this.blocks || this.paused) return;
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

    _dropAllBlocks() {
        const $blocks = $('.piles .block');
        $.each($blocks, function () {
            setTimeout(_ => {
                $(this).addClass('au-leave-active').one('animationend', _ => $(this).remove());
            }, Math.random() * 1000);
        });
    }

    _removeLetter(id) {
        const index = this.blocks.findIndex(block => block.id == id);
        if (index !== -1) {
            this.blocks.splice(index, 1);
        }
    }

    _startGame() {
        this.blocks = [];
        this.pileHeights = [...new Array(this.maxPiles)].map(_ => 0);
        $('.pile').children().remove();
        this._text = this._getLettersForCurrentLevel();
        this._addInterval = this._initialInterval;
        this._resumeGame();
        this._eventAggregator.publish('gameStarted');
    }

    _resumeGame() {
        clearInterval(this._blocksEmptyPollTimer);
        this._letterAdderIntervalId = setInterval(_ => {
            if (!this._nextLetter()) {
                this._levelComplete();
                clearInterval(this._letterAdderIntervalId);
            }
        }, this._addInterval);
    }

    _pauseGame() {
        clearInterval(this._letterAdderIntervalId);
        this._letterAdderIntervalId = undefined;
    }

}
