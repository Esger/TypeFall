export class LetterValueConverter {
    toView(letter) {
        return letter == ' ' ? '_' : letter.toUpperCase();
    }
}
