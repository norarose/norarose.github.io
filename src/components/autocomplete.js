
// to do 7/24: 
// Move into list on arrow down, enter if inside textbox AND list has results
// Prevent characters not matching pattern
// Correct entries on blur
// Figure out a way to add a default value

export default class AutoComplete_Listbox {
    constructor(textField) {
        this.comboBox = textField;
        this.listBox = this.initListBox(document.getElementById(this.comboBox.dataset.list));
        this.statusBox = document.querySelector(`output[for*=${this.comboBox.id}]`);
    }
    get defaultOption() {
        const dataDefault = this.listBox.dataset.defaultOption;
        switch (dataDefault) {
            case 'current_month':
                return this.listBox.options[new Date().getMonth()];
            case 'current_year':
                return this.listBox.options[new Date().getFullYear()];
            case undefined:
            case null:
            default:
                return this.listBox.options[0];
        }
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(bool) {
        // Toggle listbox
        this.comboBox.setAttribute('aria-expanded', bool);
        this.listBox.hidden = !bool;
        this._expanded = bool;
    }
    get selectedOption() {
        return this._selectedOption;
    }
    set selectedOption(opt) {
        // De-select previous option, if any
        if (this._selectedOption != undefined) {
            this._selectedOption.ariaSelected(false);
        }
        // Update textbox and aria-selected value
        opt.ariaSelected(true);
        this.comboBox.value = opt.dataset.value;
        this._selectedOption = opt;
    }
    set showStatus(bool) {
        if (bool === true) {
            // Populate live region with # of results if set to true
            let num = this.getAutoResults().length;
            this.statusBox.innerText = `${num} results`;
            this.comboBox.title = `${num} results`;
        }
        else {
            // Clear live region if false / falsey
            this.statusBox.innerText = '';
            this.comboBox.title = 'Start typing to see results.'
        }
    }
    initListBox(ul) {
        ul.setAttribute('role', 'listbox');
        ul.options = Array.from(ul.getElementsByTagName('li'));
        ul.options.forEach(li => {
            // Autocomplete options
            // Roving index, selected, aria-selected setter
            li.tabIndex = -1;
            li.setAttribute('role', 'option');
            li.ariaSelected = (bool) => li.setAttribute('aria-selected', bool);
            li.ariaSelected(false);
            li.onfocus = () => li.tabIndex = 0;
            li.onblur = () => li.tabIndex = -1;
            li.onclick = () => this.selectedOption = li;
            
        })
        return ul;
    }
    getOptionByIndex(index) {
        const options = this.listBox.options;
        return options[index];
    }
    getOptionByValue(value) {
        // Get autocomplete option by textbox value
        const options = this.listBox.options;
        const string = value.toLowerCase();
        const exactMatch = options.find(opt => opt.dataset.value.toLowerCase() === string);
        const startsWith = options.find(opt => opt.dataset.value.toLowerCase().startsWith(string));
        const includesVal = options.find(opt => opt.dataset.label.toLowerCase().includes(string));

        return exactMatch ? exactMatch
            : startsWith ? startsWith
            : includesVal ? includesVal
            : undefined;
    }
    getAutoResults() {
        // Get number of results to display
        const options = this.listBox.options;
        const value = this.comboBox.value;
        const string = value.toLowerCase();
        const includesVal = options.filter(opt => opt.dataset.label.toLowerCase().includes(string));
        return includesVal;
    }
    listboxInnerFocus = (e) => {
        const options = e.currentTarget.options;
        const currentIndex = options.indexOf(e.target);
        const nextOption = options[currentIndex +1];
        const prevOption = options[currentIndex -1];
        const firstOption = options[0];
        const lastOption = options[options.length -1];
        switch (e.key) {
            case 'ArrowUp':
                // Move to previous option if present
                // Otherwise wrap nav
                if (e.target === firstOption) lastOption.focus();
                else prevOption.focus();
                break;
            case 'ArrowDown':
                // Move to next option if present
                // Otherwise wrap nav
                if (e.target === lastOption) firstOption.focus();
                else nextOption.focus();
                break;
            case 'Esc':
            case 'Escape':
            case 'Tab':
                // Close list and return to textbox
                this.comboBox.focus();
                this.expanded = false;
                break;
            case 'Enter':
            case 'Space':
                // Change e.target to selected option
                // Then close list and return to textbox
                this.selectedOption = e.target;
                this.comboBox.focus();
                this.expanded = false;
                break;
            default:
                break;
        }
    }
    blockInvalid = (e) => {
        const currentValue = e.target.value;
        const pattern = this.comboBox.dataset.pattern ? new RegExp(this.comboBox.dataset.pattern)
            : this.comboBox.pattern ? new RegExp(this.comboBox.pattern) 
            : false;
        // Replace entered character with nothing if it does not match pattern
        const valid = pattern.test(e.data);
        if (valid === false) {
            const invalidRemoved = currentValue.replace(e.data, currentValue.charAt(currentValue.length));
            e.target.value = invalidRemoved;
        }
    }
    init() {
        // Default states
        this.expanded = false;
        this.showStatus = false;
        
        this.comboBox.autocomplete = 'off'; // Autocomplete is off to prevent native auto-fill
        this.comboBox.setAttribute('aria-autocomplete', 'list');
        this.comboBox.setAttribute('role', 'combobox');
        this.selectedOption = this.defaultOption;
        this.comboBox.defaultValue = this.defaultOption.value;

        this.comboBox.addEventListener('input', this.blockInvalid);
        this.listBox.addEventListener('keydown', this.listboxInnerFocus);
    }
}