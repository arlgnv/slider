/* eslint-disable max-len */

export default class Presenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.subscribe('click', this.handleClick.bind(this));
    this.view.subscribe('drag', this.handleDrag.bind(this));

    this.model.subscribe('updateState', this.handleChangeValue.bind(this));
  }

  handleClick({ trackLength }) {
    this.model.ratio = trackLength;
  }

  handleDrag({ handle, handlePosition }) {
    this.model.transformPositionToValue(handlePosition);

    // this.drawView(handle, handlePosition);
  }

  handleChangeValue(value) {
    const position = this.model.getPositionFromValue(value); console.log(position);
  }

  drawView(handle, handlePosition) {
    if (this.model.state.isVertical) {
      if (this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from, this.model.state.to]);

        this.view.changeHandlePosition(handle, handlePosition);

        const barLeftEdge = parseFloat(this.view.handleFrom.style.bottom) + this.view.handleFrom.offsetHeight / 2;
        const barRightEdge = this.view.slider.offsetHeight - (parseFloat(this.view.handleTo.style.bottom) + this.view.handleTo.offsetHeight / 2);
        this.view.changeBarFilling(barLeftEdge, barRightEdge);

        if (this.model.state.hasTip) {
          if (handle === this.view.handleFrom) {
            this.view.changeTipText(this.view.tipFrom, this.model.state.from);

            const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetHeight - handle.offsetHeight) / 2);
            this.view.changeTipPosition(this.view.tipFrom, tipPosition);
          }

          if (handle === this.view.handleTo) {
            this.view.changeTipText(this.view.tipTo, this.model.state.to);

            const tipPosition = handlePosition - Math.round((this.view.tipTo.offsetHeight - handle.offsetHeight) / 2);
            this.view.changeTipPosition(this.view.tipTo, tipPosition);
          }
        }
      }

      if (!this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from]);

        this.view.changeHandlePosition(handle, handlePosition);

        const barRightEdge = this.view.slider.offsetHeight - (handlePosition + handle.offsetHeight / 2);
        this.view.changeBarFilling(0, barRightEdge);

        if (this.model.state.hasTip) {
          this.view.changeTipText(this.view.tipFrom, this.model.state.from);

          const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetHeight - handle.offsetHeight) / 2);
          this.view.changeTipPosition(this.view.tipFrom, tipPosition);
        }
      }
    }

    if (!this.model.state.isVertical) {
      if (this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from, this.model.state.to]);

        this.view.changeHandlePosition(handle, handlePosition);

        const barLeftEdge = parseFloat(this.view.handleFrom.style.left) + this.view.handleFrom.offsetWidth / 2;
        const barRightEdge = this.view.slider.offsetWidth - (parseFloat(this.view.handleTo.style.left) + this.view.handleTo.offsetWidth / 2);
        this.view.changeBarFilling(barLeftEdge, barRightEdge);

        if (this.model.state.hasTip) {
          if (handle === this.view.handleFrom) {
            this.view.changeTipText(this.view.tipFrom, this.model.state.from);

            const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetWidth - handle.offsetWidth) / 2);
            this.view.changeTipPosition(this.view.tipFrom, tipPosition);
          }

          if (handle === this.view.handleTo) {
            this.view.changeTipText(this.view.tipTo, this.model.state.to);

            const tipPosition = handlePosition - Math.round((this.view.tipTo.offsetWidth - handle.offsetWidth) / 2);
            this.view.changeTipPosition(this.view.tipTo, tipPosition);
          }
        }
      }

      if (!this.model.state.hasInterval) {
        this.view.changeValue([this.model.state.from]);

        this.view.changeHandlePosition(handle, handlePosition);

        const barRightEdge = this.view.slider.offsetWidth - (handlePosition + handle.offsetWidth / 2);
        this.view.changeBarFilling(0, barRightEdge);

        if (this.model.state.hasTip) {
          this.view.changeTipText(this.view.tipFrom, this.model.state.from);

          const tipPosition = handlePosition - Math.round((this.view.tipFrom.offsetWidth - handle.offsetWidth) / 2);
          this.view.changeTipPosition(this.view.tipFrom, tipPosition);
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
