
export class Spinner {
    constructor(inputElement) {
        this._spinner = inputElement;
        console.log(this)
    }
    get incBtn() {
        return document.querySelector(`[data-increment=${this._spinner.id}]`);
    }
    get decBtn() {
        return document.querySelector(`[data-increment=${this._spinner.id}]`);
    }
}

export class OptionSpinner extends Spinner {
    constructor(inputElement) {
        super(inputElement);
    }
}

export class NumberSpinner extends Spinner {
    constructor(inputElement) {
        super(inputElement);
    }
}