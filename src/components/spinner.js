
export class Spinner {
    constructor(inputElement) {
        this.spinField = inputElement;
    }
    get spinUp() {
        return document.querySelector(`[data-increment=${this.spinField.id}]`);
    }
    get spinDown() {
        return document.querySelector(`[data-decrement=${this.spinField.id}]`);
    }
    set defaultValue(val) {
        this.spinField.defaultValue = val;
    }
    handleEvent(e) {
        return this[`${e.type}Event`] && 
            this[`${e.type}Event`](e);
    }
    focusEvent(e) {
        e.target.oldValue = e.target.value;
        e.target.select();
    }
    inputEvent(e) {
        // working
        let currentVal = e.target.value;
        let isValid = e.target.pattern ? new RegExp(e.target.pattern).test(e.data) : true;
        let tooLong = e.target.max ? currentVal.length > e.target.max.length : false;
        if (isValid === false || tooLong) {
            let invalidRemoved = currentVal.replace(e.data, '');
            e.target.value = invalidRemoved;
        }
    }
    init() {
        this.spinField.addEventListener('focus', this);
        if (this.spinField.pattern) {
            this.spinField.addEventListener('input', this);
        }
    }
}

export class MenuSpinner extends Spinner {
    constructor(inputElement) {
        super(inputElement);
    }
    blurEvent(e) {
        // working
        let currentVal = e.target.value;
        let options = Array.from(e.target.list.options);
        let exactMatch = options.find(opt => opt.value === currentVal);
        let startsWith = options.find(opt => opt = 
            opt.value
                .toLowerCase()
                .startsWith(currentVal.toLowerCase())
        );
        let includesVal = options.find(opt => opt = 
            opt.value
                .toLowerCase()
                .includes(currentVal.toLowerCase())
        );
        if (exactMatch) {
            return;
        }
        else if (startsWith) {
            e.target.value = startsWith.value;
        }
        else if (includesVal) {
            e.target.value = includesVal.value;
        }
        else {
            e.target.value = e.target.oldValue;
        }
    }
    init() {
        super.init();
        this.spinField.addEventListener('keydown', this);
        this.spinField.addEventListener('blur', this);
    }
}