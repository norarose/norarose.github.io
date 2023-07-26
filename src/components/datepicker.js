
class MenuSpinner {
    constructor(inputElement) {
        this.spinField = inputElement;
    }
    get updateNotif() {
        return this._updateNotif;
    }
    set updateNotif(txt) {
        this._updateNotif = document.querySelector(`output[for=${this.spinField.id}]`);
        this._updateNotif.innerHTML = txt;
    }
    get expanded() {
        return this.spinField.getAttribute('aria-expanded');
    }
    set expanded(bool) {
        this.spinField.setAttribute('aria-expanded', bool);
    }
    get upBtn() {
        return document.querySelector(`[data-increment=${this.spinField.id}]`);
    }
    get downBtn() {
        return document.querySelector(`[data-decrement=${this.spinField.id}]`);
    }
    get optionFromValue() {
        const input = this.spinField;
        const options = Array.from(input.list.options);
        const stringValue = input.value;
        const exactMatch = options.find(opt => opt.value === stringValue);
        const defaultValue = options.find(opt => opt.value === input.defaultValue);
        const startsWith = options.find(opt => opt = 
            opt.label
                .toLowerCase()
                .startsWith(stringValue.toLowerCase())
        );
        const includesVal = options.find(opt => opt = 
            opt.label
                .toLowerCase()
                .includes(stringValue.toLowerCase())
        );
        
        return exactMatch ? exactMatch
            : startsWith ? startsWith
            : includesVal ? includesVal
            : defaultValue;
    }
    getResultCount() {
        const input = this.spinField;
        const options = Array.from(input.list.options);
        const stringValue = input.value;
        const includesVal = options.filter(opt => opt = 
            opt.label
                .toLowerCase()
                .includes(stringValue.toLowerCase())
        );
        return includesVal.length;
    }
    handleEvent(e) {
        return this[`${e.type}Event`] && 
            this[`${e.type}Event`](e);
    }
    focusEvent(e) {
        e.target.lastValue = e.target.value;
        e.target.select();
    }
    inputEvent = (e) => {
        const value = e.target.value;
        const isValid = e.target.pattern ? new RegExp(e.target.pattern).test(e.data) : true;
        if (isValid === false) {
            const invalidRemoved = value.replaceAll(e.data, value.charAt(value.length));
            e.target.value = invalidRemoved;
            this.expanded = true;
        }
        const msg = document.querySelector(`output[for=${this.spinField.id}]`);
        const numResults = this.getResultCount();
        const hasEntry = e.target.value.length > 0;
        if (hasEntry) {
            this.expanded = true;
        }
        else if (!hasEntry) {
            this.expanded = false;
        }
        this.updateNotif = `${numResults} results`;
    }
    blurEvent = (e) => {
        let val = e.target.value;
        e.target.value = this.optionFromValue ? this.optionFromValue.value
            : val.length === 0? e.target.defaultValue
            : e.target.lastValue;
        this.expanded = false;
        if (e.target.lastValue != e.target.value) {
            this.updateNotif = this.optionFromValue.label;
        }
    }
    init() {
        this.expanded = false;
        this.spinField.title = 'Start typing to see results.'
        this.updateNotif = this.optionFromValue.label;
        this.spinField.addEventListener('focus', this);
        this.spinField.addEventListener('blur', this);
        this.spinField.addEventListener('input', this);
        this.spinField.addEventListener('keydown', this);
    }
}

class Datepicker {
    constructor(modal) {
        this.modal = modal;
        this.monthSpinner = new MenuSpinner(this.modal.querySelector('[data-type=month]'));
    }
    get modalBtn() {
        return document.querySelector(`[data-modal=${this.modal.id}]`);
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(bool) {
        if (this._expanded === undefined) {
            this._expanded = false;
        }
        else if (bool === true) {
            this.modal.show();
            this._expanded = true;
        }
        else if (bool === false) {
            this.modal.close();
            this._expanded = false;
        }
        this.modalBtn.setAttribute('aria-expanded', bool);
    }
    get monthIndex() {
        const spinner = this.monthSpinner;
        const field = spinner.spinField;
        const options = field.list.options;
        const selected = spinner.optionFromValue;
        return options.indexOf(selected);
    }
    set monthIndex(i) {
        const field = this.monthSpinner.spinField;
        const options = field.list.options;
        field.value = options[i].value;
    }
    init() {
        this.expanded = false;
        this.modalBtn.onclick = () => this.expanded = !this._expanded;
        this.monthIndex = new Date().getMonth();
        this.monthSpinner.spinField.defaultValue = this.monthSpinner.spinField.value;
        this.monthSpinner.init();
    }
}