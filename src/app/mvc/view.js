import { EventEmitter } from "./../utilities.js";

export default class View extends EventEmitter {
    constructor(input, slider) {
        super();

        this.input = input;
        this.slider = slider;
        this.range = slider.querySelector(".lrs__range");
        this.handle = slider.querySelector(".lrs__handle");
        this.tip = slider.querySelector(".lrs__tip");

        this.handle.addEventListener("mousedown", evt => this.handleDragStart(evt));
    }

    handleDragStart(evt) {
        evt.preventDefault();

        const info = {
            input: this.input,
            slider: this.slider,
            range: this.range,
            handle: this.handle,
            tip: this.tip,
            cursorShift: evt.clientX - evt.target.getBoundingClientRect().left
        };

        this.emit("drag", info);
    }

    changeHandlePosition(value) {
        this.handle.style.left = value + "px";
    }

    changeTipPosition(value) {
        this.tip.style.left = value + "px";
    }

    changeValue(value) {
        this.input.value = value;
    }
}