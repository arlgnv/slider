// tslint:disable:max-line-length

import EventEmitter from '../EventEmitter/EventEmitter';
import ISliderView from '../Interfaces/View/ISliderView';
import IParameters from '../Interfaces/IParameters';
import sliderTemplateHbs from '../../sliderTemplate.hbs';

export default class SliderView extends EventEmitter implements ISliderView{
  private anchorElement: JQuery<HTMLElement>;
  private slider: JQuery<HTMLElement>;
  private runnerFrom: JQuery<HTMLElement>;
  private tipFrom?: JQuery<HTMLElement>;
  private bar: JQuery<HTMLElement>;
  private runnerTo?: JQuery<HTMLElement>;
  private tipTo?: JQuery<HTMLElement>;
  private scale: JQuery<HTMLElement>;

  constructor(anchorElement: JQuery<HTMLElement>, parameters: IParameters) {
    super();

    this.anchorElement = anchorElement;

    this.init(parameters);
  }

  reDrawView(parameters: IParameters): void {
    const { firstValue, firstValuePercent, secondValue, secondValuePercent, theme,
      hasInterval, hasTip, hasScale, scaleValues, isVertical, onChange } = parameters;

    if (onChange) onChange(parameters);
    if (this.isNeedToReinit(parameters)) this.reinit(parameters);

    this.changeTheme(theme); // console.log(parameters);
    this.changeDirection(isVertical);
    this.changeRunnerPosition({ firstValuePercent, secondValuePercent, isVertical, hasInterval  });
    if (hasTip) this.changeTipText({ firstValue, secondValue, hasInterval });
    if (hasTip) this.changeTipPosition({ isVertical, hasInterval });
    if (hasScale) this.drawScale({ scaleValues, isVertical });
    this.changeBarFilling({ ...this.getBarEdges({ hasInterval, isVertical }), isVertical });
  }

  private init(parameters: IParameters): void {
    this.drawView(parameters);
    this.findDOMElements(parameters);
    this.addEventListeners();
  }

  private reinit(data: IParameters): void {
    const isNeedToShowRunnerTo = !this.runnerTo && data.hasInterval;
    if (isNeedToShowRunnerTo) {
      this.bar.after('<span class="lrs__runner"></span>');

      this.runnerTo = this.bar.next();
      this.runnerTo.on('mousedown', this.handleRunnerMouseDown.bind(this));
    }

    const isNeedToHideRunnerTo = this.runnerTo && !data.hasInterval;
    if (isNeedToHideRunnerTo) {
      this.runnerTo.remove();

      delete this.runnerTo;
    }

    const isNeedToShowTipFrom = !this.tipFrom && data.hasTip;
    if (isNeedToShowTipFrom) {
      this.bar.before('<span class="lrs__tip"></span>');

      this.tipFrom = this.runnerFrom.next();
    }

    const isNeedToHideTipFrom = this.tipFrom && !data.hasTip;
    if (isNeedToHideTipFrom) {
      this.tipFrom.remove();

      delete this.tipFrom;
    }

    const isNeedToShowTipTo = !this.tipTo && data.hasTip && data.hasInterval;
    if (isNeedToShowTipTo) {
      this.runnerTo.after('<span class="lrs__tip"></span>');

      this.tipTo = this.runnerTo.next();
    }

    const isNeedToHideTipTo = (this.tipTo && !data.hasTip) || (this.tipTo && !data.hasInterval);
    if (isNeedToHideTipTo) {
      this.tipTo.remove();

      delete this.tipTo;
    }

    const isNeedToShowScale = !this.scale && data.hasScale;
    if (isNeedToShowScale) {
      this.slider.append('<span class="lrs__scale"></span>');

      this.scale = this.slider.find(':last-child');
      this.scale.on('click', this.handleScaleClick.bind(this));
    }

    const isNeedToHideScale = this.scale && !data.hasScale;
    if (isNeedToHideScale) {
      this.scale.remove();

      delete this.scale;
    }
  }

  private isNeedToReinit(data: IParameters): boolean {
    return ((!this.tipFrom && data.hasTip) || (this.tipFrom && !data.hasTip)
      || (!this.runnerTo && data.hasInterval) || (this.runnerTo && !data.hasInterval)
      || (!this.scale && data.hasScale) || (this.scale && !data.hasScale));
  }

  private drawView(parameters: IParameters): void {
    this.anchorElement.before(sliderTemplateHbs(parameters));
  }

  private findDOMElements(parameters: IParameters): void {
    this.slider = this.anchorElement.prev();
    this.runnerFrom = this.slider.find(':first-child');
    this.bar = this.slider.find('.lrs__bar');

    if (parameters.hasInterval) this.runnerTo = this.bar.next();
    if (parameters.hasScale) this.scale = this.slider.find(':last-child');

    if (parameters.hasTip) {
      this.tipFrom = this.runnerFrom.next();

      if (parameters.hasInterval) this.tipTo = this.runnerTo.next();
    }
  }

  private addEventListeners(): void {
    this.runnerFrom.on('mousedown', this.handleRunnerMouseDown.bind(this));

    if (this.runnerTo) this.runnerTo.on('mousedown', this.handleRunnerMouseDown.bind(this));
    if (this.scale) this.scale.on('click', this.handleScaleClick.bind(this));
  }

  private handleRunnerMouseDown(evt: JQuery.ClickEvent): void {
    const $runner: JQuery<HTMLElement> = $(evt.currentTarget).addClass('lrs__runner_grabbed');
    const cursorPosition = this.getCursorPosition($runner, evt.clientX, evt.clientY);

    if (this.runnerTo) this.correctZAxis($runner);

    const handleWindowMouseMove = (event: JQuery.Event): void => {
      let runnerPosition = this.getRunnerShift(cursorPosition, event.clientX, event.clientY);
      runnerPosition = this.correctExtremeRunnerPositions($runner, runnerPosition);

      runnerPosition = this.slider.hasClass('lrs_direction_vertical')
        ? (runnerPosition * 100) / (this.slider.outerHeight() - $runner.outerHeight())
        : (runnerPosition * 100) / (this.slider.outerWidth() - $runner.outerWidth());

      const positionType = $runner[0] === this.runnerFrom[0] ? 'firstPositionPercent' : 'secondPositionPercent';

      this.notify('moveRunner', {  [positionType]: runnerPosition });
    };

    const handleWindowMouseUp = (): void => {
      $runner.removeClass('lrs__runner_grabbed');

      $(window).off('mousemove', handleWindowMouseMove);
      $(window).off('mouseup', handleWindowMouseUp);
    };

    $(window).on('mousemove', handleWindowMouseMove);
    $(window).on('mouseup', handleWindowMouseUp);
  }

  private handleScaleClick(evt: JQuery.ClickEvent): void {
    const $target: JQuery<HTMLElement> = $(evt.target);

    if ($target.hasClass('lrs__scale-mark')) {
      this.notify('clickScale', { scaleValue: +$target.text() });
    }
  }

  private getCursorPosition($target: JQuery<HTMLElement>, clientX: number, clientY: number): number {
    return this.slider.hasClass('lrs_direction_vertical')
      ? clientY + (parseFloat($target.css('bottom')) || 0) : clientX - (parseFloat($target.css('left')) || 0);
  }

  private getRunnerShift(position: number, clientX: number, clientY: number): number {
    return this.slider.hasClass('lrs_direction_vertical') ? position - clientY : clientX - position;
  }

  private correctExtremeRunnerPositions($runner: JQuery<HTMLElement>, position: number): number {
    let newPosition = position;

    if (this.slider.hasClass('lrs_direction_vertical')) {
      if (this.runnerTo) {
        if ($runner[0] === this.runnerFrom[0]) {
          const maxRunnerPosition = parseFloat(this.runnerTo.css('bottom'));

          if (position < 0) newPosition = 0;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }

        if ($runner[0] === this.runnerTo[0]) {
          const maxRunnerPosition = this.slider.outerHeight() - $runner.outerHeight();
          const minRunnerPosition = parseFloat(this.runnerFrom.css('bottom'));

          if (position < minRunnerPosition) newPosition = minRunnerPosition;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }
      }

      if (!this.runnerTo) {
        const maxRunnerPosition = this.slider.outerHeight() - $runner.outerHeight();

        if (position < 0) newPosition = 0;
        if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
      }
    }

    if (!this.slider.hasClass('lrs_direction_vertical')) {
      if (this.runnerTo) {
        if ($runner[0] === this.runnerFrom[0]) {
          const maxRunnerPosition = parseFloat(this.runnerTo.css('left'));

          if (position < 0) newPosition = 0;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }

        if ($runner[0] === this.runnerTo[0]) {
          const maxRunnerPosition = this.slider.outerWidth() - $runner.outerWidth();
          const minRunnerPosition = parseFloat(this.runnerFrom.css('left'));

          if (position < minRunnerPosition) newPosition = minRunnerPosition;
          if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
        }
      }

      if (!this.runnerTo) {
        const maxRunnerPosition = this.slider.outerWidth() - $runner.outerWidth();

        if (position < 0) newPosition = 0;
        if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
      }
    }

    return newPosition;
  }

  private correctZAxis($runner: JQuery<HTMLElement>): void {
    this.runnerFrom.removeClass('lrs__runner_last-grabbed');
    this.runnerTo.removeClass('lrs__runner_last-grabbed');

    $runner.addClass('lrs__runner_last-grabbed');
  }

  private changeRunnerPosition({ firstValuePercent, secondValuePercent, isVertical, hasInterval }): void {
    const property: string = isVertical ? 'bottom' : 'left';
    const length: string = isVertical ? 'outerHeight' : 'outerWidth';
    let position = ((this.slider[length]() - this.runnerFrom[length]()) * firstValuePercent) / 100;

    this.runnerFrom.attr('style', `${property}: ${position}px`);

    if (hasInterval) {
      position = ((this.slider[length]() - this.runnerTo[length]()) * secondValuePercent) / 100;
      this.runnerTo.attr('style', `${property}: ${position}px`);
    }
  }

  private changeTipText({ firstValue, secondValue, hasInterval }): void {
    this.tipFrom.text(firstValue);
    if (hasInterval) this.tipTo.text(secondValue);
  }

  private changeTipPosition({ isVertical, hasInterval }): void {
    const property: string = isVertical ? 'bottom' : 'left';
    const length: string = isVertical ? 'outerHeight' : 'outerWidth';
    let tip = this.tipFrom;
    let runner = this.runnerFrom;
    let position = (parseFloat(runner.css(property)) - (tip[length]() - runner[length]()) / 2);

    this.tipFrom.attr('style', `${property}: ${position}px`);

    if (hasInterval) {
      tip = this.tipTo, runner = this.runnerTo;
      position = (parseFloat(runner.css(property)) - (tip[length]() - runner[length]()) / 2);

      tip.attr('style', `${property}: ${position}px`);
    }
  }

  private getBarEdges({ hasInterval, isVertical }): {start: number, end: number} {
    const barEdges = { start: 0, end: 0 };
    const property: string = isVertical ? 'bottom' : 'left';
    const length: string = isVertical ? 'outerHeight' : 'outerWidth';
    let runner = this.runnerFrom;

    barEdges.end =
      this.slider[length]() - (parseFloat(runner.css(property)) + runner[length]() / 2);

    if (hasInterval) {
      barEdges.start = parseFloat(runner.css(property)) + runner[length]() / 2;

      runner = this.runnerTo;
      barEdges.end =
        this.slider[length]() - (parseFloat(runner.css(property)) + runner[length]() / 2);
    }

    return barEdges;
  }

  private changeBarFilling({ start, end, isVertical }): void {
    this.bar.attr('style', isVertical ? `bottom: ${start}px; top: ${end}px;` : `left: ${start}px; right: ${end}px;`);
  }

  private changeTheme(theme: string): void {
    this.slider.removeClass(`lrs_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
    this.slider.addClass(`lrs_theme_${theme === 'aqua' ? 'aqua' : 'red'}`);
  }

  private changeDirection(isVertical: boolean): void {
    if (isVertical) this.slider.addClass('lrs_direction_vertical');
    if (!isVertical) this.slider.removeClass('lrs_direction_vertical');
  }

  private drawScale({ scaleValues, isVertical }): void {
    this.scale.text('');

    const property: string = isVertical ? 'bottom' : 'left';
    const length: string = isVertical ? 'outerHeight' : 'outerWidth';
    const marks = Object.entries(scaleValues);

    for (let i: number = 0; i < marks.length; i += 1) {
      const [value, percent] = marks[i];
      const position = ((this.slider[length]() - this.runnerFrom[length]()) / 100) * +percent;

      $('<span>', {
        class: 'lrs__scale-mark',
        text: value,
        style: `${property}: ${position}px` }).appendTo(this.scale);
    }
  }
}
