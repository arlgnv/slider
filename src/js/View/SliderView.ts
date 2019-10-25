import EventEmitter from '../EventEmitter/EventEmitter';
import InputView from './InputView';
import IParameters from '../IParameters';

// @ts-ignore
import sliderTemplateHbs from '../../templates/sliderTemplate.hbs';

export default class SliderView extends EventEmitter {
  private slider: HTMLSpanElement;
  private runnerFrom: HTMLSpanElement;
  private tipFrom?: HTMLSpanElement;
  private bar: HTMLSpanElement;
  private runnerTo?: HTMLSpanElement;
  private tipTo?: HTMLSpanElement;

  constructor(private input: InputView, parameters: IParameters) {
    super();

    this.input = input;

    this.init(parameters);
  }

  reDrawView(data: IParameters): void {
    const value = this.getSliderValue(data);
    this.input.changeValue(value);

    if (data.onChange) data.onChange(this.input.getValue());

    this.changeTheme(data.theme);
    this.changeDirection(data.isVertical);

    if (this.isNeedToReinit(data)) this.reinit(data);

    this.changeRunnerPosition(data);
    this.changeTipText(data);
    this.changeTipPosition(data);

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

      this.findDOMElements(data);
      this.addEventListeners();
    }

    const isNeedToHideRunnerTo = this.runnerTo && !data.hasInterval;
    if (isNeedToHideRunnerTo) {
      this.slider.removeChild(this.runnerTo);

      delete this.runnerTo;
    }

    const isNeedToShowTipFrom = !this.tipFrom && data.hasTip;
    if (isNeedToShowTipFrom) {
      this.runnerFrom.insertAdjacentHTML('afterend', '<span class="lrs__tip"></span>');

      this.findDOMElements(data);
    }

    const isNeedToHideTipFrom = this.tipFrom && !data.hasTip;
    if (isNeedToHideTipFrom) {
      this.slider.removeChild(this.tipFrom);

      delete this.tipFrom;
    }

    const isNeedToShowTipTo = !this.tipTo && data.hasTip && data.hasInterval;
    if (isNeedToShowTipTo) {
      this.runnerTo.insertAdjacentHTML('afterend', '<span class="lrs__tip"></span>');

      this.findDOMElements(data);
    }

    const isNeedToHideTipTo = (this.tipTo && !data.hasTip) || (this.tipTo && !data.hasInterval);
    if (isNeedToHideTipTo) {
      this.slider.removeChild(this.tipTo);

      delete this.tipTo;
    }
  }

  private isNeedToReinit(data: IParameters): boolean {
    return (
      (!this.tipFrom && data.hasTip) ||
      (this.tipFrom && !data.hasTip) ||
      (!this.runnerTo && data.hasInterval) ||
      (this.runnerTo && !data.hasInterval)
    );
  }

  private drawView(parameters: IParameters): void {
    const input = this.input.getInput();

    input.insertAdjacentHTML('beforebegin', sliderTemplateHbs(parameters));
  }

  private findDOMElements(parameters: IParameters): void {
    const input = this.input.getInput();

    this.slider = input.previousElementSibling as HTMLSpanElement;
    this.runnerFrom = this.slider.firstElementChild as HTMLSpanElement;
    this.bar = this.slider.querySelector('.lrs__bar') as HTMLSpanElement;

    if (parameters.hasInterval) {
      this.runnerTo = this.bar.nextElementSibling as HTMLSpanElement;
    }

    if (parameters.hasTip) {
      this.tipFrom = this.runnerFrom.nextElementSibling as HTMLSpanElement;

      if (this.runnerTo) {
        this.tipTo = this.runnerTo.nextElementSibling as HTMLSpanElement;
      }
    }
  }

  private addEventListeners(): void {
    this.runnerFrom.addEventListener('mousedown', this.handlerRunnerMouseDown.bind(this));

    if (this.runnerTo) {
      this.runnerTo.addEventListener('mousedown', this.handlerRunnerMouseDown.bind(this));
    }
  }

  private handlerRunnerMouseDown(evt: MouseEvent): void {
    const runner: HTMLSpanElement = evt.currentTarget as HTMLSpanElement;
    const runnerType = runner === this.runnerFrom ? 'from' : 'to';
    const cursorPosition = this.getCursorPosition(runner, evt.clientX, evt.clientY);

    runner.classList.add('lrs__runner_grabbed');

    if (this.runnerTo) this.correctZAxis(runner);

    const handlerWindowMouseMove = (event: MouseEvent): void => {
      let runnerPosition = this.getRunnerShift(cursorPosition, event.clientX, event.clientY);
      runnerPosition = this.correctExtremeRunnerPositions(runner, runnerPosition);
      runnerPosition = this.slider.classList.contains('lrs_direction_vertical')
        ? (runnerPosition * 100) / (this.slider.offsetHeight - runner.offsetHeight)
        : (runnerPosition * 100) / (this.slider.offsetWidth - runner.offsetWidth);

      this.notify('moveRunner', { [runnerType]: runnerPosition });
    };

    const handlerWindowMouseUp = (): void => {
      runner.classList.remove('lrs__runner_grabbed');

      window.removeEventListener('mousemove', handlerWindowMouseMove);
      window.removeEventListener('mouseup', handlerWindowMouseUp);
    };

    window.addEventListener('mousemove', handlerWindowMouseMove);
    window.addEventListener('mouseup', handlerWindowMouseUp);
  }

  private getSliderValue(data: IParameters): string {
    const value = data.hasInterval
      ? `${Math.round(data.min + (data.from * (data.max - data.min)) / 100)} - ${Math.round(
          data.min + (data.to * (data.max - data.min)) / 100,
        )}`
      : `${Math.round(data.min + (data.from * (data.max - data.min)) / 100)}`;

    return value;
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
      ? ((this.slider.offsetHeight - this.runnerFrom.offsetHeight) * data.from) / 100
      : ((this.slider.offsetWidth - this.runnerFrom.offsetWidth) * data.from) / 100;

    this.runnerFrom.style.cssText = data.isVertical
      ? `bottom: ${position}px`
      : `left: ${position}px`;

    if (data.hasInterval) {
      position = data.isVertical
        ? ((this.slider.offsetHeight - this.runnerTo.offsetHeight) * data.to) / 100
        : ((this.slider.offsetWidth - this.runnerTo.offsetWidth) * data.to) / 100;

      this.runnerTo.style.cssText = data.isVertical
        ? `bottom: ${position}px`
        : `left: ${position}px`;
    }
  }

  private changeTipText(data: IParameters): void {
    if (data.hasTip) {
      if (data.hasInterval) {
        const [textFrom, textTo] = this.input.getValue().split(' - ');

        this.tipFrom.textContent = textFrom;
        this.tipTo.textContent = textTo;
      }

      if (!data.hasInterval) {
        this.tipFrom.textContent = this.input.getValue();
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
}
