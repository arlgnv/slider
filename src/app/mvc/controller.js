export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on("dragStart", this.drag.bind(this));
    }

    drag(evt) {
        const handle = evt.target;
        const handleOldPosition = this.getHandleOldPosition(handle, evt.clientX, evt.clientY);

        window.onmousemove = evt => {
            let handlePosition = this.getHandleNewPosition(evt.clientX, evt.clientY, handleOldPosition);

            handlePosition = this.checkExtremeHandlePositions(handlePosition, handle);

            let value = this.getValueFromHandlePosition(handlePosition);

            if (this.checkNeedToMoveHandle(value)) {
                switch (this.model.state.range) {
                    case true:
                        if (handle.classList.contains("lrs__handle-from")) this.model.state.from = value;
                        if (handle.classList.contains("lrs__handle-to")) this.model.state.to = value;

                        this.view.changeValue(this.model.state.from, this.model.state.to);

                        if (handle.classList.contains("lrs__handle-from")) {
                            handlePosition = this.getHandlePositionFromValue(this.model.state.from);
                            this.view.changeHandlePosition(handlePosition, "from");

                            const tip = handle.querySelector(".lrs__tip");
                            const tipPosition = -((tip.offsetWidth - handle.offsetWidth) / 2);
                            this.view.changeTipPosition(tipPosition, "from");
                        }

                        if (handle.classList.contains("lrs__handle-to")) {
                            handlePosition = this.getHandlePositionFromValue(this.model.state.to);
                            this.view.changeHandlePosition(handlePosition, "to");

                            const tip = handle.querySelector(".lrs__tip");
                            const tipPosition = -((tip.offsetWidth - handle.offsetWidth) / 2);
                            this.view.changeTipPosition(tipPosition, "to");
                        }
                        break;

                    case false:
                        this.model.state.from = value;

                        this.view.changeValue(this.model.state.from);

                        handlePosition = this.getHandlePositionFromValue(this.model.state.from);
                        this.view.changeHandlePosition(handlePosition, "from");

                        const tipFromPosition = -((this.view.tipFrom.offsetWidth - this.view.handleFrom.offsetWidth) / 2);
                        this.view.changeTipPosition(tipFromPosition, "from");
                        break;
                }
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

    checkExtremeHandlePositions(position, handle) {
        switch (this.model.state.range) {
            case true:
                if (handle.classList.contains("lrs__handle-from")) {
                    const maxHandleFromPosition = parseFloat(this.view.handleTo.style.left);

                    if (position < 0) position = 0;
                    if (position > maxHandleFromPosition) position = maxHandleFromPosition;
                }

                if (handle.classList.contains("lrs__handle-to")) {
                    const maxHandleToPosition = this.view.range.offsetWidth - this.view.handleTo.offsetWidth;
                    const handleFromPosition = parseFloat(this.view.handleFrom.style.left);

                    if (position < handleFromPosition) position = handleFromPosition;
                    if (position > maxHandleToPosition) position = maxHandleToPosition;
                }
                break;

            case false:
                const maxHandleFromPosition = this.view.range.offsetWidth - this.view.handleFrom.offsetWidth;

                if (position < 0) position = 0;
                if (position > maxHandleFromPosition) position = maxHandleFromPosition;
                break;
        }

        return position;
    }

    getValueFromHandlePosition(handlePosition) {
        const ratio = (this.view.range.offsetWidth - this.view.handleFrom.offsetWidth) / (this.model.state.max - this.model.state.min);
        const value = this.model.state.min + handlePosition / ratio;

        return Math.round(value);
    }

    getHandlePositionFromValue(value) {
        const ratio = (this.view.range.offsetWidth - this.view.handleFrom.offsetWidth) / (this.model.state.max - this.model.state.min);
        const handlePosition = (value - this.model.state.min) * ratio;

        return Math.round(handlePosition);
    }

    getHandleOldPosition(target, clientX, clientY) {
        switch (this.model.state.view) {
            case "vertical":
                return clientY + (parseFloat(target.style.left) || 0);

            case "horizontal":
                return clientX - (parseFloat(target.style.left) || 0);
        }
    }

    getHandleNewPosition(clientX, clientY, position) {
        switch (this.model.state.view) {
            case "vertical":
                return position - clientY;

            case "horizontal":
                return clientX - position;
        }
    }
}
