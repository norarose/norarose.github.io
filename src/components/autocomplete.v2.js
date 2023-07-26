
// WORKING as of 7/25

// To do:

export default class AutoComplete {
    constructor(textField) {
        this.comboBox = textField;
        this.listBox = AutoComplete.Listbox(this.comboBox);
        this.statusBox = document.querySelector(`output[for*=${this.comboBox.id}]`);
    }
    static Listbox(comboBox) {
        const ul = document.getElementById(comboBox.dataset.list);
        ul.setAttribute('role', 'listbox');
        ul.options = Array.from(ul.children);
        ul.options.forEach(li => {
            // some shorthand properties
            li._value = li.dataset.value;
            li._label = li.textContent;
            // Roving index
            li.tabIndex = -1;
            li.onfocus = () => li.tabIndex = -1;
            li.onblur = () => li.tabIndex = 0;
            // Aria attributes
            li.setAttribute('role', 'option');
            li.ariaSelected = (bool) => {
                if (bool) li.setAttribute('aria-selected', 'true');
                else if (!bool) li.removeAttribute('aria-selected');
            }

        })
        // Find and set default values for list
        const dataDefault = ul.dataset.defaultOption;
        switch (dataDefault) {
            case 'current_month':
                ul.defaultOption = ul.options[new Date().getMonth()];
                break;
            case 'current_year':
                ul.defaultOption = ul.options[new Date().getFullYear()];
                break;
            case null:
            case undefined:
            default:
                ul.defaultOption = ul.options[0];
                break;
        }
        ul.hideAll = () => ul.options.forEach(opt => opt.hidden = true);
        ul.showAll = () => ul.options.forEach(opt => opt.hidden = false);
        comboBox.defaultValue = ul.defaultOption._value;
        
        return ul;
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(bool) {
        this.comboBox.setAttribute('aria-expanded', bool);
        this.listBox.hidden = !bool;
        this._expanded = bool;
    }
    get selectedOption() {
        return this._selectedOption;
    }
    set selectedOption(opt) {
        // Deselect previous, if any
        if (this._selectedOption != undefined) {
            this._selectedOption.ariaSelected(false);
        }
        this.comboBox.value = opt._value;
        opt.ariaSelected(true);
        this._selectedOption = opt;
    }
    get suggestions() {
        const options = this.listBox.options;
        options.forEach((opt) => {
            // Toggle hidden state based on matching
            const valueString = this.comboBox.value.toLowerCase();
            const labelString = opt._label.toLowerCase();
            const match = labelString.startsWith(valueString);
            if (match) {
                opt.hidden = false;
            }
            else if (!match) {
                opt.hidden = true;
            };
        });

        // return options not hidden by previous function
        const suggestions = options.filter(opt => !opt.hidden);
        return suggestions;
    }
    autocomplete() {
        const textValue = this.comboBox.value.toLowerCase();
        const options = this.listBox.options;
        const exactMatch = options.find(opt => opt._value.toLowerCase() === textValue);
        const startsWith = options.find(opt => opt._value.toLowerCase().startsWith(textValue));
        const revertValue = options.find(opt => opt._value.toLowerCase() === this.oldValue);

        this.selectedOption = exactMatch ||
            startsWith ||
            revertValue ||
            this.listBox.defaultOption;
    }
    handleEvent(e) {
        const handler = this[`${e.type}Event`];
        return handler && handler(e);
    }
    focusEvent = (e) => {
        this.oldValue = e.target.value.toLowerCase();
    }
    inputEvent = (e) => {
        // Replace invalid characters with nothing if entered
        const orgValue = e.target.value;
        const regex = e.target.pattern;
        const allowedChar = regex ? new RegExp(regex).test(e.data) : true;
        if (allowedChar === false) {
            e.target.value = orgValue.replace(
                e.data, 
                orgValue.charAt(orgValue.length)
            );
        }
        
        const numResults = this.suggestions.length;
        if (e.target.value.length === 0) {
            // Close list and clear status if field is empty
            this.expanded = false;
            this.statusBox.innerText = ''
        }
        else {
            this.expanded = numResults > 0;
            this.statusBox.innerText = `${numResults} Suggestions`;
        }
    }
    init() {
        this.expanded = false;
        this.selectedOption = this.listBox.defaultOption;
        this.comboBox.setAttribute('role', 'combobox');
        this.comboBox.addEventListener('focus', this);
        this.comboBox.addEventListener('input', this);
    }
}