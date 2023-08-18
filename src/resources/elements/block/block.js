import { bindable, inject } from 'aurelia-framework';

@inject(Element)
export class BlockCustomElement {
    @bindable letter;

    constructor(element) {
        this._element = element;
    }

    attached() {
        const width = this._element.clientWidth;
        this._element.style.setProperty("--offsetX", width + 'px');
    }
}
