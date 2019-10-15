/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* global window */

import EventEmitter from '../EventEmitter/EventEmitter';
import templateFunction from '../../templates/sliderTemplate.hbs';

export default class SliderView extends EventEmitter {
  constructor(input, settings) {
    super();

    this.input = input;

    this.drawView(settings);
    this.findDOMElements();
    this.addEventListeners();
  }

  drawView(settings) {
    this.input.getInput().insertAdjacentHTML('beforeBegin', templateFunction(settings));
  }

  findDOMElements() {
    this.slider = this.input.getInput().previousElementSibling;
    this.bar = this.slider.querySelector('.lrs__bar');
    [this.runnerFrom, this.runnerTo] = this.slider.querySelectorAll('.lrs__runner');
    [this.tipFrom, this.tipTo] = this.slider.querySelectorAll('.lrs__tip');
  }

  addEventListeners() {
    this.runnerFrom.addEventListener('mousedown', this.handlerRunnerMouseDown.bind(this));
    if (this.runnerTo) this.runnerTo.addEventListener('mousedown', this.handlerRunnerMouseDown.bind(this));
  }

  handlerRunnerMouseDown(evt) {
    const runner = evt.currentTarget;
    const runnerType = runner === this.runnerFrom ? 'from' : 'to';
    const cursorPosition = this.getCursorPosition(runner, evt.clientX, evt.clientY);

    this.correctZAxis(runner);

    const handlerWindowMouseMove = (event) => {
      let runnerPosition = this.getRunnerPosition(cursorPosition, event.clientX, event.clientY);
      runnerPosition = this.correctExtremeRunnerPositions(runner, runnerPosition);

      this.notify('moveRunner', { runnerPosition, runnerType });
    };

    const handlerWindowMouseUp = () => {
      runner.classList.remove('lrs__runner_grabbed');

      window.removeEventListener('mousemove', handlerWindowMouseMove);
      window.removeEventListener('mouseup', handlerWindowMouseUp);
    };

    window.addEventListener('mousemove', handlerWindowMouseMove);
    window.addEventListener('mouseup', handlerWindowMouseUp);

    this.notify('clickRunner', this.getTrackLength(runner));
  }

  getCursorPosition(target, clientX, clientY) {
    return this.slider.classList.contains('lrs_direction_vertical')
      ? clientY + (parseFloat(target.style.bottom) || 0)
      : clientX - (parseFloat(target.style.left) || 0);
  }

  getRunnerPosition(position, clientX, clientY) {
    return this.slider.classList.contains('lrs_direction_vertical') ? position - clientY : clientX - position;
  }

  correctExtremeRunnerPositions(runner, position) {
    let newPosition = position;

    if (this.slider.classList.contains('lrs_direction_vertical')) {
      if (this.runnerTo) {
        if (runner === this.runnerFrom) {
          const maxRunnerPosition = parseFloat(this.runnerTo.style.bottom);

          if (position < 0) newPosition = 0;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }

        if (runner === this.runnerTo) {
          const maxRunnerPosition = this.slider.offsetHeight - runner.offsetHeight;
          const minRunnerPosition = parseFloat(this.runnerFrom.style.bottom);

          if (position < minRunnerPosition) newPosition = minRunnerPosition;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }
      }

      if (!this.runnerTo) {
        const maxRunnerPosition = this.slider.offsetHeight - runner.offsetHeight;

        if (position < 0) newPosition = 0;
        if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
      }
    }

    if (!this.slider.classList.contains('lrs_direction_vertical')) {
      if (this.runnerTo) {
        if (runner === this.runnerFrom) {
          const maxRunnerPosition = parseFloat(this.runnerTo.style.left);

          if (position < 0) newPosition = 0;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }

        if (runner === this.runnerTo) {
          const maxRunnerPosition = this.slider.offsetWidth - runner.offsetWidth;
          const minRunnerPosition = parseFloat(this.runnerFrom.style.left);

          if (position < minRunnerPosition) newPosition = minRunnerPosition;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }
      }

      if (!this.runnerTo) {
        const maxRunnerPosition = this.slider.offsetWidth - runner.offsetWidth;

        if (position < 0) newPosition = 0;
        if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
      }
    }

    return newPosition;
  }

  correctZAxis(runner) {
    runner.classList.add('lrs__runner_grabbed');

    if (this.runnerTo) {
      this.runnerFrom.classList.remove('lrs__runner_last-grabbed');
      this.runnerTo.classList.remove('lrs__runner_last-grabbed');
      runner.classList.add('lrs__runner_last-grabbed');
    }
  }

  reDrawView(runnerPosition, runnerType, data) {
    const inputText = data.hasInterval ? `${data.from} - ${data.to}` : data.from;
    const runner = runnerType === 'from' ? this.runnerFrom : this.runnerTo;
    const tip = runnerType === 'from' ? this.tipFrom : this.tipTo;
    const tipText = runnerType === 'from' ? data.from : data.to;

    this.input.changeValue(inputText);
    this.changeRunnerPosition(runnerPosition, runner);
    this.changeTipText(tipText, tip);
    this.changeTipPosition(runnerPosition, tip, runner);

    const { left: barLeftEdge, right: barRightEdge } = this.getBarEdges(data.hasInterval);
    this.changeBarFilling(barLeftEdge, barRightEdge);
  }

  changeRunnerPosition(position, runner) {
    runner.style.cssText = this.slider.classList.contains('lrs_direction_vertical') ? `bottom: ${position}px` : `left: ${position}px`;
  }

  changeTipPosition(position, tip, runner) {
    const tipPosition = this.slider.classList.contains('lrs_direction_vertical')
      ? position - Math.round((tip.offsetHeight - runner.offsetHeight) / 2)
      : position - Math.round((tip.offsetWidth - runner.offsetWidth) / 2);

    tip.style.cssText = this.slider.classList.contains('lrs_direction_vertical') ? `bottom: ${tipPosition}px` : `left: ${tipPosition}px`;
  }

  changeTipText(text, tip) {
    tip.textContent = text;
  }

  changeBarFilling(from, to) {
    this.bar.style.cssText = this.slider.classList.contains('lrs_direction_vertical')
      ? `bottom: ${from}px; top: ${to}px;`
      : `left: ${from}px; right: ${to}px;`;
  }

  getBarEdges(isInterval) {
    const barEdges = {
      left: 0,
      right: 0,
    };

    if (isInterval) {
      barEdges.left = this.slider.classList.contains('lrs_direction_vertical')
        ? parseFloat(this.runnerFrom.style.bottom) + this.runnerFrom.offsetHeight / 2
        : parseFloat(this.runnerFrom.style.left) + this.runnerFrom.offsetWidth / 2;

      barEdges.right = this.slider.classList.contains('lrs_direction_vertical')
        ? this.slider.offsetHeight - (parseFloat(this.runnerTo.style.bottom) + this.runnerTo.offsetHeight / 2)
        : this.slider.offsetWidth - (parseFloat(this.runnerTo.style.left) + this.runnerTo.offsetWidth / 2);
    }

    if (!isInterval) {
      barEdges.left = 0;
      barEdges.right = this.slider.classList.contains('lrs_direction_vertical')
        ? this.slider.offsetHeight - (parseFloat(this.runnerFrom.style.bottom) + this.runnerFrom.offsetHeight / 2)
        : this.slider.offsetWidth - (parseFloat(this.runnerFrom.style.left) + this.runnerFrom.offsetWidth / 2);
    }

    return barEdges;
  }

  getTrackLength(runner) {
    return this.slider.classList.contains('lrs_direction_vertical')
      ? this.slider.offsetHeight - runner.offsetWidth
      : this.slider.offsetWidth - runner.offsetWidth;
  }
}
