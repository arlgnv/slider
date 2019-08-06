export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on("dragStart", this.drag.bind(this));
    }

    drag(evt) {
        const emptySpace = (evt.clientX - evt.target.getBoundingClientRect().left) + this.view.slider.getBoundingClientRect().left;

        document.body.onmousemove = evt => {
            let handlePosition = evt.clientX - emptySpace;
            handlePosition = this.checkExtremeHandlePositions(handlePosition);
            
            let value = this.getValueFromHandlePosition(handlePosition);

            if (value !== this.model.state.value) {
                this.model.state.value = value;
                this.view.changeValue(this.model.state.value);

                handlePosition = this.getHandlePositionFromValue(this.model.state.value);
                this.view.changeHandlePosition(handlePosition);

                if (!this.model.state.hideTip) {
                    let tipPosition = Math.round(handlePosition - (this.view.tip.offsetWidth - this.view.handle.offsetWidth) / 2);
                    this.view.changeTipPosition(tipPosition);
                }
            }
        };

        document.body.onmouseup = () => {
            document.body.onmousemove = null;
            document.body.onmouseup = null;
        };
    }

    checkExtremeHandlePositions(num) {
        const maxHandlePosition = this.view.slider.offsetWidth - this.view.handle.offsetWidth;

        if (num < 0) num = 0;
        if (num > maxHandlePosition) num = maxHandlePosition;

        return num;
    }

    getValueFromHandlePosition(handlePosition) {
        let value;

        if (this.model.state.min === 0) {
            value = handlePosition / ((this.view.range.offsetWidth - this.view.handle.offsetWidth) / this.model.state.max);
        } else {
            value = this.model.state.min + Math.round(handlePosition / ((this.view.range.offsetWidth - this.view.handle.offsetWidth) / (this.model.state.max - this.model.state.min)));
        }

        return Math.round(value);
    }

    getHandlePositionFromValue(value) {
        let handlePosition;

        if (this.model.state.min === 0) {
            const ratio = ((this.view.range.offsetWidth - this.view.handle.offsetWidth) / this.model.state.max);
            handlePosition = value * ratio;
        } else {
            const ratio = (this.view.range.offsetWidth - this.view.handle.offsetWidth) / (this.model.state.max - this.model.state.min);
            handlePosition = (value - this.model.state.min) * ratio;
        }

        return Math.round(handlePosition);
    }
}
