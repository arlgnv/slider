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
    const ratio = this.getRatio(handle);

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

    if (this.model.state.isVertical) {
      cursorPosition = clientY + (parseFloat(target.style.bottom) || 0);
    }

    if (!this.model.state.isVertical) {
      cursorPosition = clientX - (parseFloat(target.style.left) || 0);
    }

    return cursorPosition;
  }

  getRatio(handle) {
    return this.model.state.isVertical
      ? (this.view.slider.offsetHeight - handle.offsetWidth) / (this.model.state.max - this.model.state.min)
      : (this.view.slider.offsetWidth - handle.offsetWidth) / (this.model.state.max - this.model.state.min);
  }

  getHandlePosition(clientX, clientY, position) {
    let handlePosition;

    if (this.model.state.isVertical) {
      handlePosition = position - clientY;
    }

    if (!this.model.state.isVertical) {
      handlePosition = clientX - position;
    }

    return handlePosition;
  }

  correctExtremeHandlePositions(position, handle) {
    let newPosition = position;

    if (this.model.state.isVertical) {
      if (this.model.state.hasInterval) {
        if (handle === this.view.handleFrom) {
          const maxHandlePosition = parseFloat(this.view.handleTo.style.bottom);

          if (position < 0) newPosition = 0;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }

        if (handle === this.view.handleTo) {
          const maxHandlePosition = this.view.slider.offsetHeight - handle.offsetHeight;
          const minHandlePosition = parseFloat(this.view.handleFrom.style.bottom);

          if (position < minHandlePosition) newPosition = minHandlePosition;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }
      }

      if (!this.model.state.hasInterval) {
        const maxHandlePosition = this.view.slider.offsetHeight - handle.offsetHeight;

        if (position < 0) newPosition = 0;
        if (position > maxHandlePosition) newPosition = maxHandlePosition;
      }
    }

    if (!this.model.state.isVertical) {
      if (this.model.state.hasInterval) {
        if (handle === this.view.handleFrom) {
          const maxHandlePosition = parseFloat(this.view.handleTo.style.left);

          if (position < 0) newPosition = 0;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }

        if (handle === this.view.handleTo) {
          const maxHandlePosition = this.view.slider.offsetWidth - handle.offsetWidth;
          const minHandlePosition = parseFloat(this.view.handleFrom.style.left);

          if (position < minHandlePosition) newPosition = minHandlePosition;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }
      }

      if (!this.model.state.hasInterval) {
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
    const isValueInRange = value > this.model.state.min && value < this.model.state.max;

    if (isValueInRange) {
      let correctedValue = Math.round((value - this.model.state.min) / this.model.state.step) * this.model.state.step + this.model.state.min;

      if (correctedValue > this.model.state.max) correctedValue = this.model.state.max;

      return correctedValue;
    }

    return value;
  }

  getHandlePositionFromValue(value, ratio) {
    return Math.round((value - this.model.state.min) * ratio);
  }

  drawView(handle, handlePosition) {
    if (this.model.state.isVertical) {
      if (this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from, this.model.state.to]);

        this.view.changeHandlePosition(handle, handlePosition, 'bottom');

        const barLeftEdge = parseFloat(this.view.handleFrom.style.bottom) + this.view.handleFrom.offsetHeight / 2;
        const barRightEdge = this.view.slider.offsetHeight - (parseFloat(this.view.handleTo.style.bottom) + this.view.handleTo.offsetHeight / 2);
        this.view.changeBarFilling(barLeftEdge, barRightEdge, ['bottom', 'top']);

        if (this.model.state.hasTip) {
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

      if (!this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from]);

        this.view.changeHandlePosition(handle, handlePosition, 'bottom');

        const barRightEdge = this.view.slider.offsetHeight - (handlePosition + handle.offsetHeight / 2);
        this.view.changeBarFilling(0, barRightEdge, ['bottom', 'top']);

        if (this.model.state.hasTip) {
          this.view.changeTipText(this.view.tipFrom, this.model.state.from);

          const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetHeight - handle.offsetHeight) / 2);
          this.view.changeTipPosition(this.view.tipFrom, tipPosition, 'bottom');
        }
      }
    }

    if (!this.model.state.isVertical) {
      if (this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from, this.model.state.to]);

        this.view.changeHandlePosition(handle, handlePosition, 'left');

        const barLeftEdge = parseFloat(this.view.handleFrom.style.left) + this.view.handleFrom.offsetWidth / 2;
        const barRightEdge = this.view.slider.offsetWidth - (parseFloat(this.view.handleTo.style.left) + this.view.handleTo.offsetWidth / 2);
        this.view.changeBarFilling(barLeftEdge, barRightEdge, ['left', 'right']);

        if (this.model.state.hasTip) {
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

      if (!this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from]);

        this.view.changeHandlePosition(handle, handlePosition, 'left');

        const barRightEdge = this.view.slider.offsetWidth - (handlePosition + handle.offsetWidth / 2);
        this.view.changeBarFilling(0, barRightEdge, ['left', 'right']);

        if (this.model.state.hasTip) {
          this.view.changeTipText(this.view.tipFrom, this.model.state.from);

          const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetWidth - handle.offsetWidth) / 2);
          this.view.changeTipPosition(this.view.tipFrom, tipPosition, 'left');
        }
      }
    }

    if (this.model.state.onChange) this.model.state.onChange(this.view.input.value);
  }

  onStart() {
    let ratio = this.getRatio(this.view.handleFrom);
    let handlePosition = this.getHandlePositionFromValue(this.model.state.from, ratio);
    this.drawView(this.view.handleFrom, handlePosition);

    if (this.model.state.hasInterval) {
      ratio = this.getRatio(this.view.handleTo);
      handlePosition = this.getHandlePositionFromValue(this.model.state.to, ratio);
      this.drawView(this.view.handleTo, handlePosition);
    }
  }
}
