
export default class Disclosure {
    constructor(button) {
        this.button = button;
        this.content = document.getElementById(this.button.data.expands);
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(bool) {
        this.content.hidden = !bool;
        this.button.setAttribute('aria-expanded', bool);
        this._expanded = bool;
    }
    get closeOnExit() {
        return this._closeOnExit;
    }
    set closeOnExit(bool) {
        if (this._closeOnExit === undefined) {
            this._closeOnExit = false;
        } 
        else if (bool === true) {
            this.content.addEventListener('focusout', this);
            this._closeOnExit = true;
        }
        else if (bool === false) {
            this.content.removeEventListener('focusout', this);
            this._closeOnExit = false;
        }
    }
    contentContains(element) {
        const descendants = Array.from(this.content.querySelectorAll('*'));
        const includesElement = descendants.includes(element);
        return includesElement;
    }
    handleEvent(e) {
        const handler = this[`${e.type}Event`];
        return handler && handler(e);
    }
    clickEvent = () => {
        this.expanded = !this._expanded;
    }
    keydownEvent = (e) => {
        const escKey = e.keyCode == 27 || e.key == 'Escape';
        if (escKey) this.expanded = false;
        if (this.contentContains(e.target)) this.button.focus();
    }
    focusoutEvent = () => {
        const containsActive = this.contentContains(document.activeElement);
        if (containsActive == false) this.expanded = false;
    }
    init() {
        this.expanded = false;
        this.button.addEventListener('click', this);
        this.button.addEventListener('keydown', this);
        this.content.addEventListener('keydown', this);
    }
}