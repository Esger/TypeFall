import { bindable, inject } from 'aurelia-framework';
import { KeyInputService } from 'services/key-input-service';

@inject(KeyInputService)
export class BoardCustomElement {

    constructor(keyInputService) {
        this._keyInputService = keyInputService;
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.blocks = [];
        const randomLetter = this.letters[Math.floor(Math.random() * this.letters.length)];
        this.blocks.push(randomLetter);
    }

    attached() {
        console.log(this.blocks);
    }

}
