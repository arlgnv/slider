/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* global window */

import EventEmitter from '../EventEmitter/EventEmitter';
import templateFunction from '../../templates/sliderTemplate.hbs';

export default class SliderView extends EventEmitter {
  constructor(input, settings) {
    super();

    this.input = input;

    this.render(settings);
    this.findDOMElements();
    this.addEventListeners();
  }

  render(settings) {
    this.input.insertAdjacentHTML('beforeBegin', templateFunction(settings));
  }

  findDOMElements() {
    this.slider = this.input.previousElementSibling;
    this.bar = this.slider.querySelector('.lrs__bar');
    [this.handleFrom, this.handleTo] = this.slider.querySelectorAll('.lrs__handle');
    [this.tipFrom, this.tipTo] = this.slider.querySelectorAll('.lrs__tip');
  }

  addEventListeners() {
    this.handleFrom.addEventListener('mousedown', this.handleMouseDown.bind(this));
    if (this.handleTo) this.handleTo.addEventListener('mousedown', this.handleMouseDown.bind(this));
  }

  handleMouseDown(evt) {
    const handle = evt.currentTarget;
    const cursorPosition = this.getCursorPosition(handle, evt.clientX, evt.clientY);
    handle.classList.add('lrs__handle_grabbed');

    if (handle === this.handleTo) this.correctAxisZ(handle);

    const handleWindowMouseMove = (event) => {
      let handlePosition = this.getHandlePosition(cursorPosition, event.clientX, event.clientY);
      handlePosition = this.correctExtremeHandlePositions(handle, handlePosition);

      this.notify('moveHandle', { handle, handlePosition });
    };

    const handleWindowMouseUp = () => {
      handle.classList.remove('lrs__handle_grabbed');

      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    const trackLength = this.slider.classList.contains('lrs_direction_vertical')
      ? this.slider.offsetHeight - handle.offsetWidth
      : this.slider.offsetWidth - handle.offsetWidth;

    this.notify('clickHandle', { trackLength });
  }

  getCursorPosition(target, clientX, clientY) {
    return this.slider.classList.contains('lrs_direction_vertical')
      ? clientY + (parseFloat(target.style.bottom) || 0)
      : clientX - (parseFloat(target.style.left) || 0);
  }

  getHandlePosition(position, clientX, clientY) {
    return this.slider.classList.contains('lrs_direction_vertical') ? position - clientY : clientX - position;
  }

  correctExtremeHandlePositions(handle, position) {
    let newPosition = position;

    if (this.slider.classList.contains('lrs_direction_vertical')) {
      if (this.handleTo) {
        if (handle === this.handleFrom) {
          const maxHandlePosition = parseFloat(this.handleTo.style.bottom);

          if (position < 0) newPosition = 0;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }

        if (handle === this.handleTo) {
          const maxHandlePosition = this.slider.offsetHeight - handle.offsetHeight;
          const minHandlePosition = parseFloat(this.handleFrom.style.bottom);

          if (position < minHandlePosition) newPosition = minHandlePosition;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }
      }

      if (!this.handleTo) {
        const maxHandlePosition = this.slider.offsetHeight - handle.offsetHeight;

        if (position < 0) newPosition = 0;
        if (position > maxHandlePosition) newPosition = maxHandlePosition;
      }
    }

    if (!this.slider.classList.contains('lrs_direction_vertical')) {
      if (this.handleTo) {
        if (handle === this.handleFrom) {
          const maxHandlePosition = parseFloat(this.handleTo.style.left);

          if (position < 0) newPosition = 0;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }

        if (handle === this.handleTo) {
          const maxHandlePosition = this.slider.offsetWidth - handle.offsetWidth;
          const minHandlePosition = parseFloat(this.handleFrom.style.left);

          if (position < minHandlePosition) newPosition = minHandlePosition;
          if (position > maxHandlePosition) newPosition = maxHandlePosition;
        }
      }

      if (!this.handleTo) {
        const maxHandlePosition = this.slider.offsetWidth - handle.offsetWidth;

        if (position < 0) newPosition = 0;
        if (position > maxHandlePosition) newPosition = maxHandlePosition;
      }
    }

    return newPosition;
  }

  correctAxisZ(handle) {
    this.handleFrom.classList.remove('lrs__handle_last-grabbed');
    this.handleTo.classList.remove('lrs__handle_last-grabbed');
    handle.classList.add('lrs__handle_last-grabbed');
  }

  changeHandlePosition(handle, value) {
    handle.style.cssText = this.slider.classList.contains('lrs_direction_vertical') ? `bottom: ${value}px` : `left: ${value}px`;
  }

  changeTipPosition(tip, value) {
    tip.style.cssText = this.slider.classList.contains('lrs_direction_vertical') ? `bottom: ${value}px` : `left: ${value}px`;
  }

  changeTipText(tip, text) {
    tip.textContent = text;
  }

  changeBarFilling(from, to) {
    this.bar.style.cssText = this.slider.classList.contains('lrs_direction_vertical')
      ? `bottom: ${from}px; top: ${to}px;`
      : `left: ${from}px; right: ${to}px;`;
  }
}
