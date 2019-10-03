/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */

import EventEmitter from '../event-emitter.js';

export default class View extends EventEmitter {
  constructor(input, template) {
    super();

    this.input = input;
    this.input.classList.add('hidden-input');
    this.input.insertAdjacentHTML('beforeBegin', template);
    this.slider = input.previousElementSibling;
    this.handleFrom = this.slider.querySelector('.lrs__handle_from');
    this.tipFrom = this.slider.querySelector('.lrs__tip_from');
    this.bar = this.slider.querySelector('.lrs__bar');
    this.handleTo = this.slider.querySelector('.lrs__handle_to');
    this.tipTo = this.slider.querySelector('.lrs__tip_to');

    this.setHandlerToHandle(this.handleFrom, this.handleDragStart.bind(this));
    if (this.handleTo) this.setHandlerToHandle(this.handleTo, this.handleDragStart.bind(this));
  }

  handleDragStart(evt) {
    if (this.handleTo) {
      this.handleFrom.classList.remove('lrs__handle_last-grabbed');
      this.handleTo.classList.remove('lrs__handle_last-grabbed');
      evt.target.classList.add('lrs__handle_last-grabbed');
    }

    evt.target.classList.add('lrs__handle_grabbed');

    this.notify('dragStart', evt);
  }

  setHandlerToHandle(handle, callback) {
    handle.addEventListener('mousedown', callback);
  }

  changeHandlePosition(handle, value, sliderView) {
    if (sliderView === 'vertical') {
      handle.style.cssText = `bottom: ${value}px`;
    } else handle.style.cssText = `left: ${value}px`;
  }

  changeTipPosition(tip, value, sliderView) {
    if (sliderView === 'vertical') {
      tip.style.cssText = `bottom: ${value}px`;
    } else tip.style.cssText = `left: ${value}px`;
  }

  changeTipText(tip, text) {
    tip.textContent = text;
  }

  changeBarFilling(from, to, sliderView) {
    if (sliderView === 'vertical') {
      this.bar.style.cssText = `bottom: ${from}px; top: ${to}px;`;
    } else this.bar.style.cssText = `left: ${from}px; right: ${to}px;`;
  }

  changeValue(valueFrom, valueTo) {
    this.input.value = valueFrom;

    if (valueTo !== undefined) this.input.value += ` - ${valueTo}`;
  }
}
