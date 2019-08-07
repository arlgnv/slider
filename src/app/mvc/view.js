import { EventEmitter } from "./../utilities.js";

export default class View extends EventEmitter {
    constructor(input, slider) {
        super();

        this.input = input;
        this.slider = slider;
        this.range = slider.querySelector(".lrs__range");
        this.handle = slider.querySelector(".lrs__handle");
        this.tip = slider.querySelector(".lrs__tip");

        this.handle.addEventListener("mousedown", this.handleDragStart.bind(this));
    }

    handleDragStart(evt) {
        this.emit("dragStart", evt);
    }

    changeHandlePosition(value) {
        this.handle.style.left = value + "px";
    }

    changeTipPosition(value) {
        if (!this.tip.classList.contains("lrs__tip--hidden")) {
            this.tip.style.left = value + "px";
        }
    }

    changeValue(value) {
        this.input.value = value;

        if (!this.tip.classList.contains("lrs__tip--hidden")) this.tip.textContent = value;
    }
}