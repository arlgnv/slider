export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on("dragStart", this.drag.bind(this));
    }

    drag(evt) {
        let handleOldPosition = this.getHandleOldPosition(evt);

        window.onmousemove = (evt) => {
            let handlePosition;
            if (this.model.state.view === "horizontal") {
                handlePosition = evt.clientX - handleOldPosition;
            } else {
                handlePosition = handleOldPosition - evt.clientY;
            }
            
            handlePosition = this.checkExtremeHandlePositions(handlePosition);

            let value = this.getValueFromHandlePosition(handlePosition);

            if ( this.checkNeedToMoveHandle(value) ) {
                this.model.state.from = value;

                this.view.changeValue(this.model.state.from);

                handlePosition = this.getHandlePositionFromValue(this.model.state.from);
                this.view.changeHandlePosition(handlePosition);
                this.view.changeTipPosition( handlePosition - ((this.view.tip.offsetWidth - this.view.handle.offsetWidth) / 2) );
            }
        };

        window.onmouseup = () => {
            window.onmousemove = null;
            window.onmouseup = null;
        };
    }

    checkNeedToMoveHandle(value) {
        return value === this.model.state.min || (value - this.model.state.min) % this.model.state.step === 0 || value === this.model.state.max;
    }

    checkExtremeHandlePositions(position) {
        const maxHandlePosition = this.view.range.offsetWidth - this.view.handle.offsetWidth;

        if (position < 0) position = 0;
        if (position > maxHandlePosition) position = maxHandlePosition;

        return position;
    }

    getValueFromHandlePosition(handlePosition) {
        const ratio = (this.view.range.offsetWidth - this.view.handle.offsetWidth) / (this.model.state.max - this.model.state.min);
        const value = this.model.state.min + handlePosition / ratio;

        return Math.round(value);
    }

    getHandlePositionFromValue(value) {
        const ratio = (this.view.range.offsetWidth - this.view.handle.offsetWidth) / (this.model.state.max - this.model.state.min);
        const handlePosition = (value - this.model.state.min) * ratio;

        return Math.round(handlePosition);
    }
}
