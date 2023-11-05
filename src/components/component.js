
import utils from "../utils.js";

export default class Component {
    constructor(element) {
        this.self = element;
    }
    get visible() {
        return utils.getAttr.visible(this.self);
    }
    get focusable() {
        return utils.getAttr.focusable(this.self);
    }
    get role() {
        return utils.getAttr.role(this.self);
    }
    set role(rName) {
        utils.setAttr.role(this.self, rName);
    }
    get descendants() {
        return Array.from(this.self.querySelectorAll('*'));
    }
    get focusableDescendants() {
        return utils.queryArray.focusable(this.self);
    }
    set randomId(prefix) {
        utils.setAttr.randomId(this.self, prefix);
    }
    set rovingIndex(bool) {
        if (bool === true) {
            this.self.tabIndex = -1;
            this.self.onblur = () => this.self.tabIndex = -1;
            this.self.onfocus = () => this.self.tabIndex = 0;
        }
        else if (!bool) {
            this.self.removeAttribute('tabindex');
            this.self.onblur = null;
            this.self.onfocus = null;
        }
    }
    get compName() {
        return this.constructor.name.toLowerCase();
    }
    hide = () => this.self.hidden = true;
    show = () => this.self.hidden = false;
    async getJSON(callback) {
        const srcId = this.self.dataset.id;
        await fetch(`${window.location.origin}/assets/json/${this.compName}.${srcId}.json`)
            .then(response => response.json())
            .then(data => callback(data))
    }
}