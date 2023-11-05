
const utils = {};


utils.setAttr = {};
utils.setAttr.role = (elem, role) => elem.setAttribute('role', role);
utils.setAttr.rovingIndex = (elem, bool) => {
    if (bool) {
        elem.tabIndex = -1;
        elem.onfocus = () => elem.tabIndex = 0;
        elem.onblur = () => elem.tabIndex = -1;
    }
    else if (!bool) {
        elem.removeAttribute('tabindex');
        elem.onfocus = null;
        elem.onblur = null;
    }
}
utils.setAttr.randomId = (elem, prefix) => {
    const random = () => new String(+new Date()).slice(this.length - 5);
    elem.id = prefix ? prefix + random()
        : elem.dataset.component ? elem.dataset.component + '_' + random()
        : elem.localName +  '_' + random();
}
utils.setAttr.ariaExpanded = (elem, bool) => elem.setAttribute('aria-expanded', bool);


utils.getAttr = {};
utils.getAttr.visible = (elem) => {
    const height = elem.getBoundingClientRect().height;
    const width = elem.getBoundingClientRect().width;
    const opacity = window.getComputedStyle(elem).getPropertyValue('opacity');
    const visibility = window.getComputedStyle(elem).getPropertyValue('visibility');
    return (
        height > 0 && 
        width > 0 && 
        opacity > 0 && 
        visibility != 'hidden'
    );
}
utils.getAttr.focusable = (elem) => {
    const tabIndexNative = elem.tabIndex >= 0;
    const tabIndexSet = elem.hasAttribute('tabindex');
    const ariaHidden = elem.matches('aria-hidden', 'true');
    const ariaDisabled = elem.matches('aria-disabled', 'true');

    return (
        (tabIndexNative || tabIndexSet) && 
        !elem.inert && 
        !elem.disabled &&
        !ariaHidden &&
        !ariaDisabled
    );
}
utils.getAttr.ariaExpanded = (elem) => elem.getAttribute('aria-expanded');
utils.getAttr.role = (elem) => elem.hasAttribute('role') ? elem.getAttribute('role') : elem.localName;


utils.queryArray = {};
utils.queryArray.focusable = (parent) => {
    const nodes = Array.from(parent.querySelectorAll('*'));
    return nodes.filter(node => 
        utils.getAttr.focusable(node) &&
        utils.getAttr.visible(node)
    );
}
utils.queryArray.tag = (parent, tags) => Array.from(parent.getElementsByTagName(tags));
utils.queryArray.selector = (parent, sel) => Array.from(parent.querySelectorAll(sel));


utils.queryFind = {};
utils.queryFind.controls = (control) => document.getElementById(control.dataset.controls);
utils.queryFind.controlledBy = (elem) => document.querySelector(`[data-controls=${elem.id}]`);


utils.fetchTemplate = async function(classObj) {
    const origin = window.location.origin;
    const constructorName = classObj.constructor.name.toLowerCase();
    const URI = `${origin}/src/components/${constructorName}/${constructorName}.html`;
    await fetch(URI)
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, "text/html"))
        .then(doc => doc.getElementById(`${constructorName}`))
        .then((template) => classObj.create && classObj.create(template))
}

utils.initComponents = (classConstructor) => {
    const constructorName = classConstructor.constructor.name.toLowerCase();
    const nodes = utils.queryArray.selector(document, `[data-component=${constructorName}]`);
    nodes.forEach(node => {
        let instance = new classConstructor(node);
        return instance.init && instance.init();
    })
}

utils.clearChildren = (elem) => {
    const child = elem.firstChild;
    while (child) {
        elem.removeChild(child);
    }
}

export default utils;