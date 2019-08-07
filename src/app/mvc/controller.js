export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on("dragStart", this.drag.bind(this));
    }

    drag(evt) {
        const handleOldPosition = evt.clientX - (parseFloat(evt.target.style.left) || 0);

        document.body.onmousemove = ({ clientX: cursorNewPosition }) => {
            let handlePosition = cursorNewPosition - handleOldPosition;
            handlePosition = this.checkExtremeHandlePositions(handlePosition);

            let value = this.getValueFromHandlePosition(handlePosition);

            if ( this.checkNeedToMoveHandle(value) ) {
                this.model.state.value = value;

                this.view.changeValue(this.model.state.value);

                handlePosition = this.getHandlePositionFromValue(this.model.state.value);
                this.view.changeHandlePosition(handlePosition);
                this.view.changeTipPosition( handlePosition - ((this.view.tip.offsetWidth - this.view.handle.offsetWidth) / 2) );
            }
        };

        document.body.onmouseup = () => {
            document.body.onmousemove = null;
            document.body.onmouseup = null;
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
