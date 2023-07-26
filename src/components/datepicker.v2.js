
import { Spinner, AutoCompleteSpinner } from "./spinner.js";



const templateClone = () => {
    const temp = document.getElementById('datepicker-template');
    const content = temp.content.cloneNode(true);
    return content.children[0];
}

export default class Datepicker {
    constructor(pickerButton) {
        this.btn = pickerButton;
        this.dialog = templateClone();
        this.monthSpinner = new AutoCompleteSpinner(this.dialog.querySelector('[data-id=month]'));
        this.yearSpinner = new Spinner(this.dialog.querySelector('[data-id=year]'));
    }
    get ariaExpanded() {
        return this._ariaExpanded;
    }
    set ariaExpanded(bool) {
        this.btn.setAttribute('aria-expanded', bool);
        this._ariaExpanded = bool;
    }
    templateClone() {
        const temp = document.getElementById('datepicker-template');
        const content = temp.content.cloneNode(true);
        return content.children[0];
    }
    observeDialog() {
        const syncStates = () => this.ariaExpanded = this.dialog.open;
        const observer = new MutationObserver(syncStates);
        observer.observe(this.dialog, { attributeFilter: ['open'] });
    }
    genIds() {
        this.dialog.id = this.btn.id + '-dialog';
        this.monthSpinner.genIds(this.dialog.id);
        this.yearSpinner.genIds(this.dialog.id);
    }
    setDefaultValues() {
        const monthField = this.monthSpinner.spinField;
        const months = Array.from(monthField.list.options);
        monthField.defaultValue = months[new Date().getMonth()].value;
        const yearField = this.yearSpinner.spinField;
        yearField.defaultValue = new Date().getFullYear();
    }
    handleEvent(e) {
        const handler = this[`${e.type}Event`];
        return handler && handler(e); 
    }
    
    init() {
        this.ariaExpanded = false;
        this.btn.insertAdjacentElement('afterend', this.dialog);
        this.btn.onclick = () => this.dialog.open = !this._ariaExpanded;
        this.observeDialog();
        this.monthSpinner.init();
        this.yearSpinner.init();
        this.setDefaultValues()
    }
}