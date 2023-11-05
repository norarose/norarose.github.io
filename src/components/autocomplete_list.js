import TextBox from "./textbox.js";
import ListBox from "./listbox.js";

export default class Autocomplete_List extends TextBox {
    constructor(element) {
        super(element);
        this.comboBox = this.self;
        this.ListBox = new ListBox(document.createElement('ul'));
    }
    findExactMatch() {
    }
    findSuggestions() {
    }
    updateList() {
        
    }
    init() {
        super.init();
        this.ListBox.hide();
        this.getJSON((j)=> this.ListBox.options = j[`${this.comboBox.dataset.ref}`]);
        this.comboBox.insertAdjacentElement('afterend', this.ListBox.self);
    }
}