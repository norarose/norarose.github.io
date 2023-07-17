import Grid from "./grid.js";
import Spinner from "./spinner.js";
import Dialog from "./dialog.js";

export default class Datepicker extends Dialog {
    constructor(dialogElement) {
        super(dialogElement);
        this._datepicker = this._dialog;
    }
}