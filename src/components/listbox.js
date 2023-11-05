import utils from "../utils.js";
import Component from "./component.js";

export default class ListBox extends Component {
    constructor(list) {
        super(list);
        this.role = 'listbox';
    }
    get options() {
        return this._options;
    }
    set options(valueArr) {
        if (this._options) {
            // Clear LI nodes if present
            utils.clearChildren(this.self);
        }
        const array = [];
        valueArr.forEach(value => {
            const option = new Component(document.createElement('li'));
            option.self.innerText = value[1];
            option.self.dataset.value = value[0];
            option.label = option.self.innerText;
            option.value = option.self.dataset.value;
            option.role = 'option';
            option.rovingIndex = true;
            this.self.appendChild(option.self)
            array.push(option);
            
        })
        this._options = array;
    }
}