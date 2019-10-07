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

  changeHandlePosition(handle, value, direction) {
    handle.style.cssText = `${direction}: ${value}px`;
  }

  changeTipPosition(tip, value, direction) {
    tip.style.cssText = `${direction}: ${value}px`;
  }

  changeTipText(tip, text) {
    tip.textContent = text;
  }

  changeBarFilling(from, to, directions) {
    this.bar.style.cssText = `${directions[0]}: ${from}px; ${directions[1]}: ${to}px;`;
  }

  changeValue(valueFrom, valueTo) {
    this.input.value = valueFrom;

    if (valueTo !== undefined) this.input.value += ` - ${valueTo}`;
  }
}
