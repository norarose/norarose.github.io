export default class CheckboxGroup {
    constructor(boxes, master) {
        this.master = master || boxes[0];
        this.group = Array.from(boxes).filter(box => box != this.master);
    }
}