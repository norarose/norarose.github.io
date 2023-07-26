import AutoComplete from "./components/autocomplete.v2.js";


function initComponentClass(classObj) {
    let dataComponent = new String(classObj.name).toLowerCase();
    let elements = document.querySelectorAll(`[data-component=${dataComponent}]`);
    for (let i = 0; i < elements.length; i++) {
        const component = new classObj(elements[i]);
        return component.init && component.init();
    }
}

initComponentClass(AutoComplete)

