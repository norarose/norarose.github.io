

export default class Spinner {
    constructor(fieldset) {
        this.dataGroup = fieldset;
        this.spinField = this.dataGroup.querySelector('input');
    }
    get ariaExpanded() {
        return this.spinField.getAttribute('aria-expanded');
    }
    set ariaExpanded(bool) {
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
            this.ariaExpanded = true;
        }
        const hasEntry = e.target.value.length > 0;
        if (hasEntry) {
            this.ariaExpanded = true;
        }
        else if (!hasEntry) {
            this.ariaExpanded = false;
        }
        //const numResults = this.getResultCount();
        //this.updateNotif = `${numResults} results`;
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
        this.ariaExpanded = false;
        this.spinField.title = 'Start typing to see results.'
        //this.updateNotif = this.optionFromValue.label;
        this.spinField.addEventListener('focus', this);
        this.spinField.addEventListener('blur', this);
        this.spinField.addEventListener('input', this);
        this.spinField.addEventListener('keydown', this);
    }
}


