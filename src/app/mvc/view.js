import { EventEmitter } from "./../utilities.js";

export default class View extends EventEmitter {
    constructor(input, slider) {
        super();

        this.input = input;
        this.slider = slider;
        this.range = slider.querySelector(".lrs__range");
        this.handleFrom = slider.querySelector(".lrs__handle-from");
        this.tipFrom = this.handleFrom.querySelector(".lrs__tip");
        this.handleTo = slider.querySelector(".lrs__handle-to");
        this.tipTo = this.handleTo.querySelector(".lrs__tip");

        this.handleFrom.addEventListener("mousedown", this.handleDragStart.bind(this));
        this.handleTo.addEventListener("mousedown", this.handleDragStart.bind(this));
    }

    handleDragStart(evt) {
        if (!evt.target.classList.contains("lrs__handle")) return;

        if (evt.target === this.handleFrom) {
            this.handleFrom.classList.add("lrs__handle--last-dragged");
            this.handleTo.classList.remove("lrs__handle--last-dragged");
        }

        if (evt.target === this.handleTo) {
            this.handleTo.classList.add("lrs__handle--last-dragged");
            this.handleFrom.classList.remove("lrs__handle--last-dragged");
        }

        this.emit("dragStart", evt);
    }

    changeHandlePosition(value, handleType) {
        if (handleType === "from") {
            this.handleFrom.style.left = value + "px";
        }

        if (handleType === "to") {
            this.handleTo.style.left = value + "px";
        }
    }

    changeTipPosition(value, tipType) {
        if (tipType === "from" && !this.tipFrom.classList.contains("lrs__tip--hidden")) {
            this.tipFrom.style.left = value + "px";
        }

        if (tipType === "to" && !this.tipTo.classList.contains("lrs__tip--hidden")) {
            this.tipTo.style.left = value + "px";
        }
    }

    changeValue(valueFrom, valueTo) {
        if (valueTo) {
            this.input.value = `${valueFrom} - ${valueTo}`;
            this.tipFrom.textContent = valueFrom;
            this.tipTo.textContent = valueTo;
        } else {
            this.input.value = valueFrom;
            this.tipFrom.textContent = valueFrom;
        }
    }
}