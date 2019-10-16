/* eslint-disable max-len */
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
      let runnerPosition = this.getRunnerShift(cursorPosition, event.clientX, event.clientY);
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

    this.notify('clickRunner', { dividend: this.getTrackLength(runnerType), runnerType });
  }

  getCursorPosition(target, clientX, clientY) {
    return this.slider.classList.contains('lrs_direction_vertical')
      ? clientY + (parseFloat(target.style.bottom) || 0)
      : clientX - (parseFloat(target.style.left) || 0);
  }

  getRunnerShift(position, clientX, clientY) {
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

  reDrawView(data) {
    const inputText = data.hasInterval ? `${data.from} - ${data.to}` : data.from;

    this.input.changeValue(inputText);
    this.changeRunnerPosition(data);
    this.changeTipText(data);
    this.changeTipPosition(data);
    const { left: barLeftEdge, right: barRightEdge } = this.getBarEdges(data);
    this.changeBarFilling(barLeftEdge, barRightEdge, data);
  }

  changeRunnerPosition(data) {
    if (Object.keys(data.positions).length > 1) {
      this.runnerFrom.style.cssText = data.isVertical ? `bottom: ${data.positions.from}px` : `left: ${data.positions.from}px`;
      this.runnerTo.style.cssText = data.isVertical ? `bottom: ${data.positions.to}px` : `left: ${data.positions.to}px`;
    } else {
      const runner = 'from' in data.positions ? this.runnerFrom : this.runnerTo;
      const runnerType = 'from' in data.positions ? 'from' : 'to';

      runner.style.cssText = data.isVertical ? `bottom: ${data.positions[runnerType]}px` : `left: ${data.positions[runnerType]}px`;
    }
  }

  changeTipText(data) {
    if (data.hasTip) {
      if (Object.keys(data.positions).length > 1) {
        this.tipFrom.textContent = data.from;
        this.tipTo.textContent = data.to;
      } else {
        const tip = 'from' in data.positions ? this.tipFrom : this.tipTo;
        const tipType = 'from' in data.positions ? 'from' : 'to';

        tip.textContent = data[tipType];
      }
    }
  }

  changeTipPosition(data) {
    if (data.hasTip) {
      if (Object.keys(data.positions).length > 1) {
        const tipFromPosition = data.isVertical
          ? data.positions.from - Math.round((this.tipFrom.offsetHeight - this.runnerFrom.offsetHeight) / 2)
          : data.positions.from - Math.round((this.tipFrom.offsetWidth - this.runnerFrom.offsetWidth) / 2);
        this.tipFrom.style.cssText = data.isVertical ? `bottom: ${tipFromPosition}px` : `left: ${tipFromPosition}px`;

        const tipToPosition = data.isVertical
          ? data.positions.to - Math.round((this.tipTo.offsetHeight - this.runnerTo.offsetHeight) / 2)
          : data.positions.to - Math.round((this.tipTo.offsetWidth - this.runnerTo.offsetWidth) / 2);
        this.tipTo.style.cssText = data.isVertical ? `bottom: ${tipToPosition}px` : `left: ${tipToPosition}px`;
      } else {
        const tip = 'from' in data.positions ? this.tipFrom : this.tipTo;
        const runner = tip.previousElementSibling;
        const tipType = 'from' in data.positions ? 'from' : 'to';
        const tipFromPosition = data.isVertical
          ? data.positions[tipType] - Math.round((tip.offsetHeight - runner.offsetHeight) / 2)
          : data.positions[tipType] - Math.round((tip.offsetWidth - runner.offsetWidth) / 2);

        tip.style.cssText = data.isVertical ? `bottom: ${tipFromPosition}px` : `left: ${tipFromPosition}px`;
      }
    }
  }

  changeBarFilling(from, to, data) {
    this.bar.style.cssText = data.isVertical
      ? `bottom: ${from}px; top: ${to}px;`
      : `left: ${from}px; right: ${to}px;`;
  }

  getBarEdges(data) {
    const barEdges = {
      left: 0,
      right: 0,
    };

    if (data.hasInterval) {
      barEdges.left = data.isVertical
        ? parseFloat(this.runnerFrom.style.bottom) + this.runnerFrom.offsetHeight / 2
        : parseFloat(this.runnerFrom.style.left) + this.runnerFrom.offsetWidth / 2;

      barEdges.right = data.isVertical
        ? this.slider.offsetHeight - (parseFloat(this.runnerTo.style.bottom) + this.runnerTo.offsetHeight / 2)
        : this.slider.offsetWidth - (parseFloat(this.runnerTo.style.left) + this.runnerTo.offsetWidth / 2);
    }

    if (!data.hasInterval) {
      barEdges.left = 0;
      barEdges.right = data.isVertical
        ? this.slider.offsetHeight - (parseFloat(this.runnerFrom.style.bottom) + this.runnerFrom.offsetHeight / 2)
        : this.slider.offsetWidth - (parseFloat(this.runnerFrom.style.left) + this.runnerFrom.offsetWidth / 2);
    }

    return barEdges;
  }

  getTrackLength(runnerType) {
    const runner = runnerType === 'from' ? this.runnerFrom : this.runnerTo;

    return this.slider.classList.contains('lrs_direction_vertical')
      ? this.slider.offsetHeight - runner.offsetWidth
      : this.slider.offsetWidth - runner.offsetWidth;
  }

  getSliderType() {
    return this.runnerTo ? 'interval' : 'single';
  }
}
