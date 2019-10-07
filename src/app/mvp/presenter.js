/* eslint-disable max-len */
/* global window */

export default class Presenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.onStart();

    this.view.subscribe('dragStart', this.dragStart.bind(this));
  }

  dragStart(event) {
    const handle = event.target;
    const cursorPosition = this.getCursorPosition(handle, event.clientX, event.clientY);
    const ratio = this.getRatio(handle, this.model.state.vertical);

    window.onmousemove = (evt) => {
      let handlePosition = this.getHandlePosition(evt.clientX, evt.clientY, cursorPosition);
      handlePosition = this.correctExtremeHandlePositions(handlePosition, handle);

      let value = this.getValueFromHandlePosition(handlePosition, ratio);
      value = this.correctValueWithStep(value);

      if (handle === this.view.handleFrom) {
        this.model.state.from = value;
        handlePosition = this.getHandlePositionFromValue(this.model.state.from, ratio);
      }

      if (handle === this.view.handleTo) {
        this.model.state.to = value;
        handlePosition = this.getHandlePositionFromValue(this.model.state.to, ratio);
      }

      this.drawView(handle, handlePosition);
    };

    window.onmouseup = () => {
      handle.classList.remove('lrs__handle_grabbed');
      window.onmousemove = null;
      window.onmouseup = null;
    };
  }

  getCursorPosition(target, clientX, clientY) {
    let cursorPosition;

    if (this.model.state.vertical) {
      cursorPosition = clientY + (parseFloat(target.style.bottom) || 0);
    }

    if (!this.model.state.vertical) {
      cursorPosition = clientX - (parseFloat(target.style.left) || 0);
    }

    return cursorPosition;
  }

  getRatio(handle, isVertical) {
    let ratio;

    if (isVertical) {
      ratio = (this.view.slider.offsetHeight - handle.offsetWidth) / (this.model.state.max - this.model.state.min);
    }

    if (!isVertical) {
      ratio = (this.view.slider.offsetWidth - handle.offsetWidth) / (this.model.state.max - this.model.state.min);
    }

    return ratio;
  }

  getHandlePosition(clientX, clientY, position) {
    let handlePosition;

    if (this.model.state.vertical) {
      handlePosition = position - clientY;
    }

    if (!this.model.state.vertical) {
      handlePosition = clientX - position;
    }

    return handlePosition;
  }

  correctExtremeHandlePositions(position, handle) {
    let newPosition = position;

    if (this.model.state.vertical) {
      if (this.model.state.range === true) {
        if (handle.classList.contains('lrs__handle_from')) {
          const maxHandlePosition = parseFloat(this.view.handleTo.style.bottom);

          if (position < 0) newPosition = 0;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }

        if (handle.classList.contains('lrs__handle_to')) {
          const maxHandlePosition = this.view.slider.offsetHeight - handle.offsetHeight;
          const minHandlePosition = parseFloat(this.view.handleFrom.style.bottom);

          if (position < minHandlePosition) newPosition = minHandlePosition;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }
      }

      if (this.model.state.range === false) {
        const maxHandlePosition = this.view.slider.offsetHeight - handle.offsetHeight;

        if (position < 0) newPosition = 0;
        if (position > maxHandlePosition) newPosition = maxHandlePosition;
      }
    }

    if (!this.model.state.vertical) {
      if (this.model.state.range === true) {
        if (handle.classList.contains('lrs__handle_from')) {
          const maxHandlePosition = parseFloat(this.view.handleTo.style.left);

          if (position < 0) newPosition = 0;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }

        if (handle.classList.contains('lrs__handle_to')) {
          const maxHandlePosition = this.view.slider.offsetWidth - handle.offsetWidth;
          const minHandlePosition = parseFloat(this.view.handleFrom.style.left);

          if (position < minHandlePosition) newPosition = minHandlePosition;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }
      }

      if (this.model.state.range === false) {
        const maxHandlePosition = this.view.slider.offsetWidth - handle.offsetWidth;

        if (position < 0) newPosition = 0;
        if (position > maxHandlePosition) newPosition = maxHandlePosition;
      }
    }

    return newPosition;
  }

  getValueFromHandlePosition(handlePosition, ratio) {
    return this.model.state.min + Math.round((handlePosition / ratio));
  }

  correctValueWithStep(value) {
    if (value === this.model.state.min || value === this.model.state.max) return value;

    let correctedValue = Math.round((value - this.model.state.min) / this.model.state.step) * this.model.state.step + this.model.state.min;

    if (correctedValue > this.model.state.max) correctedValue = this.model.state.max;

    return correctedValue;
  }

  getHandlePositionFromValue(value, ratio) {
    return Math.round((value - this.model.state.min) * ratio);
  }

  drawView(handle, handlePosition) {
    if (this.model.state.vertical) {
      if (this.model.state.range === true) {
        this.view.changeValue(this.model.state.from, this.model.state.to);

        this.view.changeHandlePosition(handle, handlePosition, 'bottom');

        const barLeftEdge = parseFloat(this.view.handleFrom.style.bottom) + this.view.handleFrom.offsetHeight / 2;
        const barRightEdge = this.view.slider.offsetHeight - (parseFloat(this.view.handleTo.style.bottom) + this.view.handleTo.offsetHeight / 2);
        this.view.changeBarFilling(barLeftEdge, barRightEdge, ['bottom', 'top']);

        if (this.model.state.tip === true) {
          if (handle === this.view.handleFrom) {
            this.view.changeTipText(this.view.tipFrom, this.model.state.from);

            const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetHeight - handle.offsetHeight) / 2);
            this.view.changeTipPosition(this.view.tipFrom, tipPosition, 'bottom');
          }

          if (handle === this.view.handleTo) {
            this.view.changeTipText(this.view.tipTo, this.model.state.to);

            const tipPosition = handlePosition - Math.round((this.view.tipTo.offsetHeight - handle.offsetHeight) / 2);
            this.view.changeTipPosition(this.view.tipTo, tipPosition, 'bottom');
          }
        }
      }

      if (this.model.state.range === false) {
        this.view.changeValue(this.model.state.from);

        this.view.changeHandlePosition(handle, handlePosition, 'bottom');

        const barRightEdge = this.view.slider.offsetHeight - (handlePosition + handle.offsetHeight / 2);
        this.view.changeBarFilling(0, barRightEdge, ['bottom', 'top']);

        if (this.model.state.tip === true) {
          this.view.changeTipText(this.view.tipFrom, this.model.state.from);

          const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetHeight - handle.offsetHeight) / 2);
          this.view.changeTipPosition(this.view.tipFrom, tipPosition, 'bottom');
        }
      }
    }

    if (!this.model.state.vertical) {
      if (this.model.state.range === true) {
        this.view.changeValue(this.model.state.from, this.model.state.to);

        this.view.changeHandlePosition(handle, handlePosition, 'left');

        const barLeftEdge = parseFloat(this.view.handleFrom.style.left) + this.view.handleFrom.offsetWidth / 2;
        const barRightEdge = this.view.slider.offsetWidth - (parseFloat(this.view.handleTo.style.left) + this.view.handleTo.offsetWidth / 2);
        this.view.changeBarFilling(barLeftEdge, barRightEdge, ['left', 'right']);

        if (this.model.state.tip === true) {
          if (handle === this.view.handleFrom) {
            this.view.changeTipText(this.view.tipFrom, this.model.state.from);

            const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetWidth - handle.offsetWidth) / 2);
            this.view.changeTipPosition(this.view.tipFrom, tipPosition, 'left');
          }

          if (handle === this.view.handleTo) {
            this.view.changeTipText(this.view.tipTo, this.model.state.to);

            const tipPosition = handlePosition - Math.round((this.view.tipTo.offsetWidth - handle.offsetWidth) / 2);
            this.view.changeTipPosition(this.view.tipTo, tipPosition, 'left');
          }
        }
      }

      if (this.model.state.range === false) {
        this.view.changeValue(this.model.state.from);

        this.view.changeHandlePosition(handle, handlePosition, 'left');

        const barRightEdge = this.view.slider.offsetWidth - (handlePosition + handle.offsetWidth / 2);
        this.view.changeBarFilling(0, barRightEdge, ['left', 'right']);

        if (this.model.state.tip === true) {
          this.view.changeTipText(this.view.tipFrom, this.model.state.from);

          const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetWidth - handle.offsetWidth) / 2);
          this.view.changeTipPosition(this.view.tipFrom, tipPosition, 'left');
        }
      }
    }

    if (this.model.state.onChange) this.model.state.onChange(this.view.input.value);
  }

  onStart() {
    let ratio = this.getRatio(this.view.handleFrom, this.model.state.vertical);
    let handlePosition = this.getHandlePositionFromValue(this.model.state.from, ratio);
    this.drawView(this.view.handleFrom, handlePosition);

    if (this.model.state.range === true) {
      ratio = this.getRatio(this.view.handleTo, this.model.state.vertical);
      handlePosition = this.getHandlePositionFromValue(this.model.state.to, ratio);
      this.drawView(this.view.handleTo, handlePosition);
    }
  }
}
