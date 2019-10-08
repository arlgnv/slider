/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */

import EventEmitter from './event-emitter.js';

export default class View extends EventEmitter {
  constructor(input) {
    super();

    this.input = input;
    this.slider = input.previousElementSibling;
    this.bar = this.slider.querySelector('.lrs__bar');
    [this.handleFrom, this.handleTo] = this.slider.querySelectorAll('.lrs__handle');
    [this.tipFrom, this.tipTo] = this.slider.querySelectorAll('.lrs__tip');

    this.addEventListeners();
  }

  addEventListeners() {
    this.handleFrom.addEventListener('mousedown', this.handleDragStart.bind(this));
    if (this.handleTo) this.handleTo.addEventListener('mousedown', this.handleDragStart.bind(this));
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

  changeValue(value) {
    this.input.value = value.join(' - ');
  }
}
