import Component from "./component.js";

export default class TextBox extends Component {
    constructor(element) {
        super(element);
    }
    get charPattern() {
        return this.self.dataset.allow ? new RegExp(this.self.dataset.allow) : false;
    }
    set charPattern(chars) {
        this.self.dataset.allow = chars;
    }
    blockInvalid = (e) => {
        const regex = this.charPattern;
        const currentValue = e.target.value;
        const isValid = regex.test(e.data);
        if (!isValid) {
            const nothing = currentValue.charAt(currentValue.length);
            const removed = currentValue.replaceAll(e.data, nothing);
            e.target.value = removed;
        }
    }
    init() {
        if (this.charPattern) {
            this.self.addEventListener('input', this.blockInvalid);
        }
    }
}