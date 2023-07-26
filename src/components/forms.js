
export default class FormField {
    constructor(inputElement) {
        this.field = inputElement;
    }
    get label() {
        return this.field.labels[0];
    }
    get regEx() {
        return this.field.pattern ? new RegExp(`^${this.field.pattern}+$`)
            : this.field.data.allowChars ? new RegExp(`^${this.field.data.allowChars}+$`)
            : this.field.autocomplete ? 
    }
}