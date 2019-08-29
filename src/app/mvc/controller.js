/* eslint-disable default-case */
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on('dragStart', this.drag.bind(this));
  }

  drag(event) {
    const handle = event.target;
    const handleOldPosition = this.getHandleOldPosition(handle, event.clientX, event.clientY);

    window.onmousemove = (evt) => {
      let handlePosition = this.getHandleNewPosition(evt.clientX, evt.clientY, handleOldPosition);

      handlePosition = this.checkExtremeHandlePositions(handlePosition, handle);

      const value = this.getValueFromHandlePosition(handlePosition);

      if (this.checkNeedToMoveHandle(value)) this.updateApplication(value, handle);
    };

    window.onmouseup = () => {
      window.onmousemove = null;
      window.onmouseup = null;
    };
  }

  updateApplication(value, handle) {
    if (handle.classList.contains('lrs__handle-from')) this.model.state.from = value;
    if (handle.classList.contains('lrs__handle-to')) this.model.state.to = value;

    this.view.changeValue(this.model.state.from);

    const handlePosition = this.getHandlePositionFromValue(value);
    this.view.changeHandlePosition(handlePosition, handle);

    const tip = handle.querySelector('.lrs__tip');
    const tipFromPosition = -((tip.offsetWidth - handle.offsetWidth) / 2);
    this.view.changeTipPosition(tipFromPosition, tip);

    let progressBarRightEdge = this.view.range.offsetWidth - (handlePosition + handle.offsetWidth / 2);
    this.view.changeProgressBarFilling(0, progressBarRightEdge);

    if (this.model.state.range) {
      this.view.changeValue(this.model.state.from, this.model.state.to);

      const progressBarLeftEdge = parseFloat(this.view.handleFrom.style.left) + this.view.handleFrom.offsetWidth / 2;
      progressBarRightEdge = this.view.range.offsetWidth - (parseFloat(this.view.handleTo.style.left) + this.view.handleTo.offsetWidth / 2);
      this.view.changeProgressBarFilling(progressBarLeftEdge, progressBarRightEdge);
    }
  }

  checkNeedToMoveHandle(value) {
    return (
      value === this.model.state.min
      || (value - this.model.state.min) % this.model.state.step === 0
      || value === this.model.state.max
    );
  }

  checkExtremeHandlePositions(position, handle) {
    switch (this.model.state.range) {
      case true:
        if (handle.classList.contains('lrs__handle-from')) {
          const maxHandlePosition = parseFloat(this.view.handleTo.style.left);

          if (position < 0) position = 0;
          if (position > maxHandlePosition) position = maxHandlePosition;
        }

        if (handle.classList.contains('lrs__handle-to')) {
          const maxHandlePosition = this.view.range.offsetWidth - handle.offsetWidth;
          const minHandlePosition = parseFloat(this.view.handleFrom.style.left);

          if (position < minHandlePosition) position = minHandlePosition;
          if (position > maxHandlePosition) position = maxHandlePosition;
        }
        break;

      case false:
        const maxHandlePosition = this.view.range.offsetWidth - handle.offsetWidth;

        if (position < 0) position = 0;
        if (position > maxHandlePosition) position = maxHandlePosition;
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
    let handlePosition;

    switch (this.model.state.view) {
      case 'vertical':
        handlePosition = clientY + (parseFloat(target.style.left) || 0);
        break;

      case 'horizontal':
        handlePosition = clientX - (parseFloat(target.style.left) || 0);
        break;
    }

    return handlePosition;
  }

  getHandleNewPosition(clientX, clientY, position) {
    let handlePosition;

    switch (this.model.state.view) {
      case 'vertical':
        handlePosition = position - clientY;
        break;

      case 'horizontal':
        handlePosition = clientX - position;
        break;
    }

    return handlePosition;
  }
}
