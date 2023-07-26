

export class Spinner {
    constructor(fieldset) {
        this.spinGroup = fieldset;
        this.spinField = this.spinGroup.querySelector('[type=text]');
        this.spinLabel = this.spinGroup.querySelector('legend label');
        this.spinUp = this.spinGroup.querySelector('[data-increment]');
        this.spinDown = this.spinGroup.querySelector('[data-decrement]');
        this.spinUp.step = 1;
        this.spinUp.step = -1;
    }
    genIds() {
        this.spinGroup.id = this.spinGroup.id || 'spinner-' + +new Date();
        this.spinField.id = this.spinGroup.id + '-field';
        this.spinLabel.htmlFor = this.spinField.id;
        this.spinUp.id = this.spinGroup.id + '-increment';
        this.spinDown.id = this.spinGroup.id + '-decrement';
    }
    
    handleEvent(e) {
        const handler = this[`${e.type}Event`];
        return handler && handler(e);
    }
    inputEvent = (e) => {
        const value = e.target.value;
        const isValid = e.target.pattern ? new RegExp(e.target.pattern).test(e.data) : true;
        if (isValid === false) {
            const invalidRemoved = value.replaceAll(e.data, value.charAt(value.length));
            e.target.value = invalidRemoved;
        }
    }
    focusEvent(e) {
        e.target.oldValue = e.target.value;
        e.target.select();
    }
    init() {
        this.genIds();
        this.spinField.addEventListener('focus', this);
        this.spinField.addEventListener('blur', this);
        this.spinField.addEventListener('input', this);
    }
}

export class NumSpinner extends Spinner {
    constructor(fieldset) {
        super(fieldset)
    }
}

export class AutoCompleteSpinner extends Spinner {
    constructor(fieldset) {
        super(fieldset);
        this.spinMenu = this.spinGroup.querySelector('datalist');
        this.autoResults = this.spinGroup.querySelector('output');
        this.autoResults.htmlFor = this.spinField.id;
    }
    get optionAsString() {
        return this.getMenuOptionFromValue().value;
    }
    get ariaExpanded() {
        return this._ariaExpanded;
    }
    set ariaExpanded(bool) {
        this.spinField.setAttribute('aria-expanded', bool);
        this._ariaExpanded = bool;
    }
    updateSpinLabels() {
        const activeOption = this.getMenuOptionFromValue();
        const options = Array.from(this.spinField.list.options);
        const index = options.indexOf(activeOption);
        const previousOption = options[index - 1] || options[options.length - 1];
        const nextOption = options[index + 1] || options[0];

        this.spinUp.innerText = nextOption.value;
        this.spinDown.innerText = previousOption.value;
    }
    getMenuOptionFromValue() {
        const input = this.spinField;
        const options = Array.from(input.list.options);
        const stringValue = input.value;
        const exactMatch = options.find(opt => opt.value === stringValue);
        const startsWith = options.find(opt => opt = 
            opt.label
                .toLowerCase()
                .startsWith(stringValue.toLowerCase())
        );

        const oldValue = options.find(opt => opt.value === input.oldValue);
        const defaultValue = options.find(opt => opt.value === input.defaultValue);
        // Keeps showing buttons as dec and feb
        return exactMatch ? exactMatch
            : startsWith ? startsWith
            : oldValue ? oldValue
            : defaultValue;
    }
    getAutoCompleteResultCount() {
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
            let num = this.getAutoCompleteResultCount();
            this.autoResults.innerText = `Showing ${num} results`;
        }
        else if (!hasEntry) {
            this.ariaExpanded = false;
            this.autoResults.innerText = '';
        }
    }
    blurEvent = (e) => {
        const matchOption = this.getMenuOptionFromValue();
        const revert = e.target.oldValue || e.target.defaultValue || '';
        e.target.value = matchOption ? matchOption.value : revert;
        this.ariaExpanded = false;
        this.autoResults.innerText = '';
        this.updateSpinLabels();
    }
    init() {
        super.init();
        this.spinMenu.id = this.spinGroup.id + '-menu';
        this.spinField.setAttribute('list', this.spinMenu.id)
        this.updateSpinLabels();
    }
}