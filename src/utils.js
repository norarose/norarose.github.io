
const utils = {};

utils.getter = {};

utils.getter.visible = (element) => {
    let height = element.getBoundingClientRect().height;
    let width = element.getBoundingClientRect().width;
    let opacity = window.getComputedStyle(element).getPropertyValue('opacity');
    let visibility = window.getComputedStyle(element).getPropertyValue('visibility');
    return (
        height > 0 && 
        width > 0 && 
        opacity > 0 && 
        visibility != 'hidden'
    );
}

utils.getter.focusable = (element) => {
    let tabIndexNative = element.tabIndex >= 0;
    let tabIndexSet = element.hasAttribute('tabindex');
    let ariaHidden = element.matches('aria-hidden', 'true');
    let ariaDisabled = element.matches('aria-disabled', 'true');
    return (
        (tabIndexNative || tabIndexSet) && 
        !element.inert && 
        !element.disabled &&
        !ariaHidden &&
        !ariaDisabled
    );
}

utils.query = {};

utils.query.focusable = (scope) => {
    let descendants = Array.from(scope.querySelectorAll('*'));
    return descendants.filter(elem => elem = 
        utils.getter.visible(elem) &&
        utils.getter.focusable(elem)
    );
}

utils.query.controlledBy = (control) => {
    return document.getElementById(control.dataset.controls);
}

utils.query.controlFor = (element) => {
    return document.querySelector(`[data-controls=${element.id}]`)
}

utils.event = {};

export default utils;

