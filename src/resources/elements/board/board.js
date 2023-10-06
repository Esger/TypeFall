import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class BoardCustomElement {
    @bindable paused
    @bindable gameOver
    @bindable initial

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this._letters = [' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this._initialInterval = 1000; //1000;
        this._maxBlocks = 100;
        this._typedCount = 0;
        this.maxPiles = 19;
        this.random = false;
        this._levels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];
        this._level = this._levels[0];
        this._texts = {
            level1: {
                'nl': 'Als dak af daf jak laks saf sjaak klad dal flak afas sa das klaf dasklaf jakaf dakaf as sja daf ska la daf slak laks klaas da alf fa sa jas afdas fad daskla laska fjaskl als dals jas flas laf jaklas slas fjasa fadlas dakafslas laksfa sjal as skas dalska slaf afj daja asla ad afslas daf lask sask sajda alfda aflas sklad dakas slaj ajla alfask asak flaj klasd dask sadak ska sjad jaklasd adfa sjak salda fadak asa alaf afjla skald aflsa klafsa saskla fja dafas ajlad alfa afda dala safad afa daf asd sfa jasla fadlasa skad sl af sja asda.',
                'en': 'sad ask lad flask fad alfalfa salad lads fads alfa add slad jafas ads fald jak safal salfas skad dal slas saf lass alfa afla safja sladja al jafad sadad afad alfad daj jafal saad sklad skald fadaf sladask fajad lask flak faa jakla sada jasla skaf alfaad jafads safada asja aksad faf jakala jad aflad fja jakad slada jas askala aj fasa sal dask ladj jakald safja dalska daf skald ladsa jakadl faj fadals slaf laka jadka ala adsl fjala fask fajka slak asaj dalf jaak salf lja fasa faal jakas'
            },
            level2: {
                'nl': 'In de schemering van de tijd, waar dromen en werkelijkheid elkaar ontmoeten als oude vrienden, strekte het duistere mysterie van de nacht zich uit over de stad. Een stad diep doordrenkt met geheimen, verborgen achter de facade van schijnbare normaliteit. Hier begint ons verhaal, waarvan de hoofdrolspeler zijn weg baant door het doolhof van zijn eigen ziel, terwijl de schaduwen fluisteren en de maan haar bleke licht werpt op de verborgen waarheden die zich in de donkerste hoeken verschuilen. Dit is een verhaal van betovering en bedrog, van onverwachte ontmoetingen en vergeten herinneringen, een verhaal dat zich afspeelt in een wereld waar de grens tussen wat echt is en wat slechts een droom lijkt te vervagen, zoals de zachte afdruk van een verloren kus op de rand van de nacht.',
                'en': 'In the twilight of time, where dreams and reality intertwine like old friends, the enigmatic shroud of night stretched across the city. A city steeped in secrets, concealed beneath the veneer of apparent normalcy. Here, our tale commences, with its protagonist navigating the labyrinth of his own soul, as shadows whisper and the moon casts its pale light upon the hidden truths lurking in the darkest corners. This is a narrative of enchantment and deception, of chance encounters and forgotten memories, a tale set in a realm where the boundary between what is real and what appears to be but a dream blurs, much like the gentle imprint of a lost kiss on the edge of night.',
                'random': 'random'
            }
        };
        this.nextCharIndex = 0;
    }

    attached() {
        this._startStopSubscription = this._eventAggregator.subscribe('startGame', _ => setTimeout(_ => this._startGame()));
        this._letterRemoveSubscription = this._eventAggregator.subscribe('remove', id => this._removeLetter(id));
        this._keyboardSubscription = this._eventAggregator.subscribe('key', key => this._checkTyped(key));
        this._pauseSubscription = this._eventAggregator.subscribe('pause', _ => this._togglePause());
        this._gameOverSubscription = this._eventAggregator.subscribe('gameOver', _ => this._dropAllBlocks());
        this._scoreSubscription = this._eventAggregator.subscribe('score', score => this._adjustGameSpeed(score));
        this._languageToggleSubscription = this._eventAggregator.subscribe('languageChanged', value => {
            this.random = value == 'random';
            this._text = this._texts[this._level][value];
        });
    }

    detached() {
        clearInterval(this._letterAdderInterval);
        this._startStopSubscription.dispose();
        this._letterRemoveInterval?.dispose();
        this._keyboardSubscription?.dispose();
        this._pauseSubscription.dispose();
        this._languageToggleSubscription.dispose();
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

    _nextLetter() {
        if (this.paused || this.blocks?.length > this._maxBlocks) return;
        let letter;
        if (this.random) {
            letter = this._letters[Math.floor(Math.random() * this._letters.length)];
        } else {
            const nextChar = this._text.charAt(this.nextCharIndex).toLocaleLowerCase();
            letter = this._letters.includes(nextChar) ? nextChar : undefined;
            this.nextCharIndex = Math.round(this.nextCharIndex + 1);
            this.nextCharIndex = this.nextCharIndex > this._text.length ? 0 : this.nextCharIndex;
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
        this._addInterval = this._initialInterval;
        this._resumeGame();
    }

    _resumeGame() {
        if (this.gameOver) return;
        clearInterval(this._letterAdderInterval);
        this._letterAdderInterval = setInterval(_ => this._nextLetter(), this._addInterval);
    }

    _pauseGame() {
        clearInterval(this._letterAdderInterval);
        this._letterAdderInterval = undefined;
    }

    _togglePause() {
        if (this.initial || this.gameOver) return;
        this.paused ? this._resumeGame() : this._pauseGame();
    }

    _endGame() {
        this.gameOver = true;
        this._pauseGame();
    }

}
