import { EventEmitter } from "./../utilities.js";

export default class View extends EventEmitter {
    constructor(input, slider) {
        super();

        this.input = input;
        this.slider = slider;
        this.range = slider.querySelector(".lrs__range");
        this.progressBar = slider.querySelector(".lrs__progress-bar");
        this.handleFrom = slider.querySelector(".lrs__handle-from");
        this.tipFrom = this.handleFrom.querySelector(".lrs__tip");
        this.handleTo = slider.querySelector(".lrs__handle-to");
        this.tipTo = this.handleTo.querySelector(".lrs__tip");

        this.handleFrom.addEventListener("mousedown", this.handleDragStart.bind(this));
        this.handleTo.addEventListener("mousedown", this.handleDragStart.bind(this));
    }

    handleDragStart(evt) {
        if (!evt.target.classList.contains("lrs__handle")) return;

        this.handleFrom.classList.remove("lrs__handle--last-dragged");
        this.handleTo.classList.remove("lrs__handle--last-dragged");
        evt.target.classList.add("lrs__handle--last-dragged");

        this.emit("dragStart", evt);
    }

    changeHandlePosition(value, handle) {
        handle.style.left = value + "px";
    }

    changeTipPosition(value, tip) {
        if (!tip.classList.contains("lrs__tip--hidden")) {
            tip.style.left = value + "px";
        }
    }

    changeProgressBarFilling(from, to) {
        this.progressBar.style.cssText = `left: ${from}px; right: ${to}px;`;
    }

    changeValue(valueFrom, valueTo) {
        if (valueTo == undefined) {
            this.input.value = valueFrom;
        } else {
            this.input.value = `${valueFrom} - ${valueTo}`;
            this.tipTo.textContent = valueTo;
        }

        this.tipFrom.textContent = valueFrom;
    }
}
