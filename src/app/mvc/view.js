export default class View {
    constructor(input, slider) {
        this.input = input;
        this.slider = slider;
        this.range = slider.querySelector(".lrs__range");
        this.handle = slider.querySelector(".lrs__handle");
        this.tip = slider.querySelector(".lrs__tip");

        //this.handle.addEventListener("mousedown", () => this.handleDragStart);
        this.handle.onmousedown = () => this.handleDragStart;
    }

    handleDragStart() {

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