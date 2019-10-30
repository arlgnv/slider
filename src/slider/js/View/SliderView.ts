import EventEmitter from '../EventEmitter/EventEmitter';
import IParameters from '../Interfaces/IParameters';

// @ts-ignore
import sliderTemplateHbs from '../../sliderTemplate.hbs';

export default class SliderView extends EventEmitter {
  private anchorElement: HTMLElement;
  private slider: HTMLSpanElement;
  private runnerFrom: HTMLSpanElement;
  private tipFrom?: HTMLSpanElement;
  private bar: HTMLSpanElement;
  private runnerTo?: HTMLSpanElement;
  private tipTo?: HTMLSpanElement;
  private scale: HTMLSpanElement;

  constructor(anchorElement: HTMLElement, parameters: IParameters) {
    super();

    this.anchorElement = anchorElement;

    this.init(parameters);
  }

  reDrawView(data: IParameters): void {
    const valueText = data.hasInterval ? `${data.firstValue} - ${data.secondValue}` : `${data.firstValue}`;

    if (data.onChange) data.onChange(valueText); // console.log(data);

    this.changeTheme(data.theme);
    this.changeDirection(data.isVertical);

    if (this.isNeedToReinit(data)) this.reinit(data);

    this.changeRunnerPosition(data);
    this.changeTipText(data);
    this.changeTipPosition(data);
    this.drawScale(data);

    const { left: barLeftEdge, right: barRightEdge } = this.getBarEdges(data);
    this.changeBarFilling(barLeftEdge, barRightEdge, data);
  }

  private init(parameters: IParameters): void {
    this.drawView(parameters);
    this.findDOMElements(parameters);
    this.addEventListeners();
  }

  private reinit(data: IParameters): void {
    const isNeedToShowRunnerTo = !this.runnerTo && data.hasInterval;
    if (isNeedToShowRunnerTo) {
      this.bar.insertAdjacentHTML('afterend', '<span class="lrs__runner"></span>');

      this.runnerTo = this.bar.nextElementSibling as HTMLSpanElement;
      this.addEventListeners();
    }

    const isNeedToHideRunnerTo = this.runnerTo && !data.hasInterval;
    if (isNeedToHideRunnerTo) {
      this.slider.removeChild(this.runnerTo);

      delete this.runnerTo;
    }

    const isNeedToShowTipFrom = !this.tipFrom && data.hasTip;
    if (isNeedToShowTipFrom) {
      this.bar.insertAdjacentHTML('beforebegin', '<span class="lrs__tip"></span>');

      this.tipFrom = this.runnerFrom.nextElementSibling as HTMLSpanElement;
    }

    const isNeedToHideTipFrom = this.tipFrom && !data.hasTip;
    if (isNeedToHideTipFrom) {
      this.slider.removeChild(this.tipFrom);

      delete this.tipFrom;
    }

    const isNeedToShowTipTo = !this.tipTo && data.hasTip && data.hasInterval;
    if (isNeedToShowTipTo) {
      this.runnerTo.insertAdjacentHTML('afterend', '<span class="lrs__tip"></span>');

      this.tipTo = this.runnerTo.nextElementSibling as HTMLSpanElement;
    }

    const isNeedToHideTipTo = (this.tipTo && !data.hasTip) || (this.tipTo && !data.hasInterval);
    if (isNeedToHideTipTo) {
      this.slider.removeChild(this.tipTo);

      delete this.tipTo;
    }

    const isNeedToShowScale = !this.scale && data.hasScale;
    if (isNeedToShowScale) {
      this.slider.insertAdjacentHTML('beforeend', '<span class="lrs__scale"></span>');

      this.scale = this.slider.lastElementChild as HTMLSpanElement;
      this.addEventListeners();
    }

    const isNeedToHideScale = this.scale && !data.hasScale;
    if (isNeedToHideScale) {
      this.slider.removeChild(this.scale);

      delete this.scale;
    }
  }

  private isNeedToReinit(data: IParameters): boolean {
    return (
      (!this.tipFrom && data.hasTip) ||
      (this.tipFrom && !data.hasTip) ||
      (!this.runnerTo && data.hasInterval) ||
      (this.runnerTo && !data.hasInterval) ||
      (!this.scale && data.hasScale) ||
      (this.scale && !data.hasScale)
    );
  }

  private drawView(parameters: IParameters): void {
    this.anchorElement.insertAdjacentHTML('beforebegin', sliderTemplateHbs(parameters));
  }

  private findDOMElements(parameters: IParameters): void {
    this.slider = this.anchorElement.previousElementSibling as HTMLSpanElement;
    this.runnerFrom = this.slider.firstElementChild as HTMLSpanElement;
    this.bar = this.slider.querySelector('.lrs__bar') as HTMLSpanElement;

    if (parameters.hasInterval) {
      this.runnerTo = this.bar.nextElementSibling as HTMLSpanElement;
    }

    if (parameters.hasTip) {
      this.tipFrom = this.runnerFrom.nextElementSibling as HTMLSpanElement;

      if (parameters.hasInterval) {
        this.tipTo = this.runnerTo.nextElementSibling as HTMLSpanElement;

      }
    }

    if (parameters.hasScale) {
      this.scale = this.slider.lastElementChild as HTMLSpanElement;
    }
  }

  private addEventListeners(): void {
    this.runnerFrom.addEventListener('mousedown', this.handleRunnerMouseDown.bind(this));

    if (this.runnerTo) {
      this.runnerTo.addEventListener('mousedown', this.handleRunnerMouseDown.bind(this));
    }

    if (this.scale) {
      this.scale.addEventListener('click', this.handleScaleClick.bind(this));
    }
  }

  private handleRunnerMouseDown(evt: MouseEvent): void {
    const runner: HTMLSpanElement = evt.currentTarget as HTMLSpanElement;
    const cursorPosition = this.getCursorPosition(runner, evt.clientX, evt.clientY);

    runner.classList.add('lrs__runner_grabbed');

    if (this.runnerTo) this.correctZAxis(runner);

    const handlerWindowMouseMove = (event: MouseEvent): void => {
      let runnerPosition = this.getRunnerShift(cursorPosition, event.clientX, event.clientY);
      runnerPosition = this.correctExtremeRunnerPositions(runner, runnerPosition);
      runnerPosition = this.slider.classList.contains('lrs_direction_vertical')
        ? (runnerPosition * 100) / (this.slider.offsetHeight - runner.offsetHeight)
        : (runnerPosition * 100) / (this.slider.offsetWidth - runner.offsetWidth);

      const positionType = runner === this.runnerFrom ? 'firstPositionPercent' : 'secondPositionPercent';

      this.notify('moveRunner', {  [positionType]: runnerPosition });
    };

    const handlerWindowMouseUp = (): void => {
      runner.classList.remove('lrs__runner_grabbed');

      window.removeEventListener('mousemove', handlerWindowMouseMove);
      window.removeEventListener('mouseup', handlerWindowMouseUp);
    };

    window.addEventListener('mousemove', handlerWindowMouseMove);
    window.addEventListener('mouseup', handlerWindowMouseUp);
  }

  private handleScaleClick(evt: MouseEvent): void {
    const target: HTMLSpanElement = evt.target as HTMLSpanElement;

    if (target.classList.contains('lrs__scale-mark')) {
      this.notify('clickScale', { scaleValue: +target.textContent });
    }
  }

  private getCursorPosition(target: HTMLSpanElement, clientX: number, clientY: number): number {
    return this.slider.classList.contains('lrs_direction_vertical')
      ? clientY + (parseFloat(target.style.bottom) || 0)
      : clientX - (parseFloat(target.style.left) || 0);
  }

  private getRunnerShift(position: number, clientX: number, clientY: number): number {
    return this.slider.classList.contains('lrs_direction_vertical')
      ? position - clientY
      : clientX - position;
  }

  private correctExtremeRunnerPositions(runner: HTMLElement, position: number): number {
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

  private correctZAxis(runner: HTMLElement): void {
    this.runnerFrom.classList.remove('lrs__runner_last-grabbed');
    this.runnerTo.classList.remove('lrs__runner_last-grabbed');

    runner.classList.add('lrs__runner_last-grabbed');
  }

  private changeRunnerPosition(data: IParameters): void {
    let position = data.isVertical
      ? ((this.slider.offsetHeight - this.runnerFrom.offsetHeight) * data.firstValuePercent) / 100
      : ((this.slider.offsetWidth - this.runnerFrom.offsetWidth) * data.firstValuePercent) / 100;

    this.runnerFrom.style.cssText = data.isVertical
      ? `bottom: ${position}px`
      : `left: ${position}px`;

    if (data.hasInterval) {
      position = data.isVertical
        ? ((this.slider.offsetHeight - this.runnerTo.offsetHeight) * data.secondValuePercent) / 100
        : ((this.slider.offsetWidth - this.runnerTo.offsetWidth) * data.secondValuePercent) / 100;

      this.runnerTo.style.cssText = data.isVertical
        ? `bottom: ${position}px`
        : `left: ${position}px`;
    }
  }

  private changeTipText(data: IParameters): void {
    if (data.hasTip) {
      this.tipFrom.textContent = String(data.firstValue);

      if (data.hasInterval) {
        this.tipTo.textContent = String(data.secondValue);
      }
    }
  }

  private changeTipPosition(data: IParameters): void {
    if (data.hasTip) {
      let runner = this.runnerFrom;
      let runnerPosition = data.isVertical
        ? parseFloat(runner.style.bottom)
        : parseFloat(runner.style.left);
      let tip = this.tipFrom;
      let tipPosition = data.isVertical
        ? runnerPosition - (tip.offsetHeight - runner.offsetHeight) / 2
        : runnerPosition - (tip.offsetWidth - runner.offsetWidth) / 2;

      this.tipFrom.style.cssText = data.isVertical
        ? `bottom: ${tipPosition}px`
        : `left: ${tipPosition}px`;

      if (data.hasInterval) {
        runner = this.runnerTo;
        runnerPosition = data.isVertical
          ? parseFloat(runner.style.bottom)
          : parseFloat(runner.style.left);
        tip = this.tipTo;
        tipPosition = data.isVertical
          ? runnerPosition - (tip.offsetHeight - runner.offsetHeight) / 2
          : runnerPosition - (tip.offsetWidth - runner.offsetWidth) / 2;

        this.tipTo.style.cssText = data.isVertical
          ? `bottom: ${tipPosition}px`
          : `left: ${tipPosition}px`;
      }
    }
  }

  private getBarEdges(data: IParameters): any {
    const barEdges = {
      left: 0,
      right: 0,
    };

    if (data.hasInterval) {
      barEdges.left = data.isVertical
        ? parseFloat(this.runnerFrom.style.bottom) + this.runnerFrom.offsetHeight / 2
        : parseFloat(this.runnerFrom.style.left) + this.runnerFrom.offsetWidth / 2;

      barEdges.right = data.isVertical
        ? this.slider.offsetHeight -
          (parseFloat(this.runnerTo.style.bottom) + this.runnerTo.offsetHeight / 2)
        : this.slider.offsetWidth -
          (parseFloat(this.runnerTo.style.left) + this.runnerTo.offsetWidth / 2);
    }

    if (!data.hasInterval) {
      barEdges.left = 0;
      barEdges.right = data.isVertical
        ? this.slider.offsetHeight -
          (parseFloat(this.runnerFrom.style.bottom) + this.runnerFrom.offsetHeight / 2)
        : this.slider.offsetWidth -
          (parseFloat(this.runnerFrom.style.left) + this.runnerFrom.offsetWidth / 2);
    }

    return barEdges;
  }

  private changeBarFilling(from: number, to: number, data: IParameters): void {
    this.bar.style.cssText = data.isVertical
      ? `bottom: ${from}px; top: ${to}px;`
      : `left: ${from}px; right: ${to}px;`;
  }

  private changeTheme(theme: string): void {
    if (theme === 'aqua') {
      this.slider.classList.remove('lrs_theme_red');
      this.slider.classList.add('lrs_theme_aqua');
    }

    if (theme === 'red') {
      this.slider.classList.remove('lrs_theme_aqua');
      this.slider.classList.add('lrs_theme_red');
    }
  }

  private changeDirection(isVertical: boolean): void {
    if (isVertical) {
      this.slider.classList.add('lrs_direction_vertical');
    }

    if (!isVertical) {
      this.slider.classList.remove('lrs_direction_vertical');
    }
  }

  private drawScale(parameters: IParameters): void {
    if (parameters.scaleValues) {
      this.scale.textContent = '';

      const elements = [];
      const valuesElems = Object.entries(parameters.scaleValues);

      for (let i: number = 0; i < valuesElems.length; i += 1) {
        const [value, percent] = valuesElems[i];

        const mark = document.createElement('span');
        mark.classList.add('lrs__scale-mark');
        mark.textContent = value;

        const position = parameters.isVertical
        ? ((this.slider.offsetHeight - this.runnerFrom.offsetHeight) / 100) * percent
        : ((this.slider.offsetWidth - this.runnerFrom.offsetWidth) / 100) * percent;

        mark.style.cssText = parameters.isVertical ? `bottom: ${position}px` :`left: ${position}px`;

        elements.push(mark);
      }

      this.scale.append(...elements);
    }
  }
}
