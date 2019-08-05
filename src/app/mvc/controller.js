import { checkExtremeHandlePositions } from "./../utilities.js";

export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on("dragStart", this.drag.bind(this));
    }

    drag(evt) {
        const cursorShift = evt.clientX - evt.target.getBoundingClientRect().left;
        const sliderCoords = this.view.slider.getBoundingClientRect();
        const minHandlePosition = 0;
        const maxHandlePosition = this.view.slider.offsetWidth - this.view.handle.offsetWidth;

        document.body.onmousemove = evt => {
            let handlePosition = evt.clientX - cursorShift - sliderCoords.left;
            handlePosition = checkExtremeHandlePositions(handlePosition, minHandlePosition, maxHandlePosition);

            //let { tipPosition } = this.model.state;
            //tipPosition = Math.ceil(handlePosition - (this.view.tip.offsetWidth - this.model.state["handleWidth"]) / 2);

            this.view.changeHandlePosition(handlePosition);
            //this.view.changeTipPosition(tipPosition);
            //this.view.changeValue(value);
        };

        document.body.onmouseup = () => {
            document.body.onmousemove = null;
            document.body.onmouseup = null;
        };
    }
}