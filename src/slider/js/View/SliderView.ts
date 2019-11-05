// tslint:disable:max-line-length

import EventEmitter from '../EventEmitter/EventEmitter';
import ISliderView from '../Interfaces/View/ISliderView';
import IParameters from '../Interfaces/IParameters';
import IFullParameters from '../Interfaces/IFullParameters';
import sliderTemplateHbs from '../../sliderTemplate.hbs';

export default class SliderView extends EventEmitter implements ISliderView {
  private anchorElement: JQuery;
  private slider: JQuery;
  private runnerFrom: JQuery;
  private tipFrom?: JQuery;
  private bar: JQuery;
  private runnerTo?: JQuery;
  private tipTo?: JQuery;
  private scale: JQuery;
  private movedRunner?: JQuery;

  constructor(anchorElement: JQuery, parameters: IParameters) {
    super();

    this.anchorElement = anchorElement;

    this.init(parameters);
  }

  redrawView(parameters: IFullParameters, changed?: IFullParameters): void {
    const { isVertical, theme } = parameters;

    if (this.isNeedToReinit(parameters)) this.reinit(parameters);
    this.changeDirection(isVertical);
    this.changeTheme(theme);
    if ('firstValuePercent' in changed || 'secondValuePercent' in changed || 'isVertical' in changed) this.updateRunner(parameters);
    if (parameters.hasTip && ('firstValue' in changed || 'secondValue' in changed || changed.hasTip === true  || 'isVertical' in changed)) this.updateTip(parameters);
    if (parameters.hasScale && ('min' in changed || 'max' in changed || 'step' in changed || changed.hasScale === true || 'isVertical' in changed)) this.drawScale(parameters);
    this.changeBarFilling({ ...this.getBarEdges(parameters), isVertical });
    if (parameters.onChange) parameters.onChange(parameters);
  }

  private init(parameters: IParameters): void {
    this.drawView(parameters);
    this.findDOMElements(parameters);
    this.addEventListeners();
  }

  private reinit({ hasTip, hasInterval, hasScale }: IFullParameters): void {
    const isNeedToShowRunnerTo = !this.runnerTo && hasInterval;
    if (isNeedToShowRunnerTo) {
      this.bar.after('<span class="lrs__runner"></span>');

      this.runnerTo = this.bar.next();
      this.runnerTo.on('mousedown', this.handleRunnerMouseDown.bind(this));
    }

    const isNeedToHideRunnerTo = this.runnerTo && !hasInterval;
    if (isNeedToHideRunnerTo) {
      this.runnerTo.remove();

      delete this.runnerTo;
    }

    const isNeedToShowTipFrom = !this.tipFrom && hasTip;
    if (isNeedToShowTipFrom) {
      this.bar.before('<span class="lrs__tip"></span>');

      this.tipFrom = this.runnerFrom.next();
    }

    const isNeedToHideTipFrom = this.tipFrom && !hasTip;
    if (isNeedToHideTipFrom) {
      this.tipFrom.remove();

      delete this.tipFrom;
    }

    const isNeedToShowTipTo = !this.tipTo && hasTip && hasInterval;
    if (isNeedToShowTipTo) {
      this.runnerTo.after('<span class="lrs__tip"></span>');

      this.tipTo = this.runnerTo.next();
    }

    const isNeedToHideTipTo = (this.tipTo && !hasTip) || (this.tipTo && !hasInterval);
    if (isNeedToHideTipTo) {
      this.tipTo.remove();

      delete this.tipTo;
    }

    const isNeedToShowScale = !this.scale && hasScale;
    if (isNeedToShowScale) {
      this.slider.append('<span class="lrs__scale"></span>');

      this.scale = this.slider.find(':last-child');
      this.scale.on('click', this.handleScaleClick.bind(this));
    }

    const isNeedToHideScale = this.scale && !hasScale;
    if (isNeedToHideScale) {
      this.scale.remove();

      delete this.scale;
    }
  }

  private isNeedToReinit({ hasTip, hasInterval, hasScale }: IFullParameters): boolean {
    return ((!this.tipFrom && hasTip) || (this.tipFrom && !hasTip)
      || (!this.runnerTo && hasInterval) || (this.runnerTo && !hasInterval)
      || (!this.scale && hasScale) || (this.scale && !hasScale));
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

    $(window).on('resize', () => this.notify('windowResize'));
  }

  private handleRunnerMouseDown(evt: JQuery.ClickEvent): void {
    const $runner: JQuery = $(evt.currentTarget).addClass('lrs__runner_grabbed');
    this.movedRunner = $runner;
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
      delete this.movedRunner;
      $runner.removeClass('lrs__runner_grabbed');

      $(window).off('mousemove', handleWindowMouseMove);
      $(window).off('mouseup', handleWindowMouseUp);
    };

    $(window).on('mousemove', handleWindowMouseMove);
    $(window).on('mouseup', handleWindowMouseUp);
  }

  private handleScaleClick(evt: JQuery.ClickEvent): void {
    const $target: JQuery = $(evt.target);

    if ($target.hasClass('lrs__scale-mark')) {
      this.notify('clickScale', { scaleValue: +$target.text() });
    }
  }

  private getCursorPosition($target: JQuery, clientX: number, clientY: number): number {
    return this.slider.hasClass('lrs_direction_vertical')
      ? clientY + (parseFloat($target.css('bottom')) || 0) : clientX - (parseFloat($target.css('left')) || 0);
  }

  private getRunnerShift(position: number, clientX: number, clientY: number): number {
    return this.slider.hasClass('lrs_direction_vertical') ? position - clientY : clientX - position;
  }

  private correctExtremeRunnerPositions($runner: JQuery, position: number): number {
    let newPosition = position;
    const property: string = this.slider.hasClass('lrs_direction_vertical') ? 'bottom' : 'left';
    const length: string = this.slider.hasClass('lrs_direction_vertical') ? 'outerHeight' : 'outerWidth';

    if (this.runnerTo) {
      if ($runner[0] === this.runnerFrom[0]) {
        const maxRunnerPosition = parseFloat(this.runnerTo.css(property));

        if (position < 0) newPosition = 0;
        if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
      }

      if ($runner[0] === this.runnerTo[0]) {
        const maxRunnerPosition = this.slider[length]() - $runner[length]();
        const minRunnerPosition = parseFloat(this.runnerFrom.css(property));

        if (position < minRunnerPosition) newPosition = minRunnerPosition;
        if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
      }
    }

    if (!this.runnerTo) {
      const maxRunnerPosition = this.slider[length]() - $runner[length]();

      if (position < 0) newPosition = 0;
      if (position > maxRunnerPosition) newPosition = maxRunnerPosition;
    }

    return newPosition;
  }

  private correctZAxis($runner: JQuery): void {
    this.runnerFrom.removeClass('lrs__runner_last-grabbed');
    this.runnerTo.removeClass('lrs__runner_last-grabbed');

    $runner.addClass('lrs__runner_last-grabbed');
  }

  private updateRunner({ firstValuePercent = null, secondValuePercent = null, isVertical }: IFullParameters): void {
    const property = isVertical ? 'bottom' : 'left';
    const sliderSize = isVertical ? this.slider.outerHeight() : this.slider.outerWidth();

    if (firstValuePercent !== null) {
      const runnerSize = isVertical ? this.runnerFrom.outerHeight() : this.runnerFrom.outerWidth();
      this.runnerFrom.attr('style', `${property}: ${((sliderSize - runnerSize) * firstValuePercent) / 100}px`);
    }

    if (secondValuePercent !== null) {
      const runnerSize = isVertical ? this.runnerTo.outerHeight() : this.runnerTo.outerWidth();
      this.runnerTo.attr('style', `${property}: ${((sliderSize - runnerSize) * secondValuePercent) / 100}px`);
    }
  }

  private updateTip({ firstValue = null, secondValue = null, isVertical }: IFullParameters): void {
    const property: string = isVertical ? 'bottom' : 'left';
    const length: string = isVertical ? 'outerHeight' : 'outerWidth';

    if (firstValue !== null) {
      this.tipFrom.text(firstValue);
      const position = (parseFloat(this.runnerFrom.css(property)) - (this.tipFrom[length]() - this.runnerFrom[length]()) / 2);
      this.tipFrom.attr('style', `${property}: ${position}px`);
    }

    if (secondValue !== null) {
      this.tipTo.text(secondValue);
      const position = (parseFloat(this.runnerTo.css(property)) - (this.tipTo[length]() - this.runnerTo[length]()) / 2);
      this.tipTo.attr('style', `${property}: ${position}px`);
    }
  }

  private getBarEdges({ hasInterval, isVertical }: IFullParameters): {leftEdge: number, rightEdge: number} {
    const property: string = isVertical ? 'bottom' : 'left';
    const leftEdge = hasInterval ? parseFloat(this.runnerFrom.css(property)) : 0;
    const rightEdge = hasInterval
      ? this.slider[isVertical ? 'outerHeight' : 'outerWidth']() - parseFloat(this.runnerTo.css(property))
      : this.slider[isVertical ? 'outerHeight' : 'outerWidth']() - parseFloat(this.runnerFrom.css(property));

    return { leftEdge, rightEdge };
  }

  private changeBarFilling({ leftEdge, rightEdge, isVertical }): void {
    this.bar.attr('style', isVertical ? `bottom: ${leftEdge}px; top: ${rightEdge}px;` : `left: ${leftEdge}px; right: ${rightEdge}px;`);
  }

  private changeTheme(theme: string): void {
    this.slider.removeClass(`lrs_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
    this.slider.addClass(`lrs_theme_${theme === 'aqua' ? 'aqua' : 'red'}`);
  }

  private changeDirection(isVertical: boolean): void {
    if (isVertical) this.slider.addClass('lrs_direction_vertical');
    if (!isVertical) this.slider.removeClass('lrs_direction_vertical');
  }

  private drawScale({ min, max, step, isVertical }: IFullParameters): void {
    this.scale.text('');

    const property: string = isVertical ? 'bottom' : 'left';
    const length: string = isVertical ? 'outerHeight' : 'outerWidth';

    $('<span>', { class: 'lrs__scale-mark', text: min, style: `${property}: 0px` }).appendTo(this.scale);

    for (let i: number = min + step; i < max; i += step) {
      const percent = ((i - min) * 100) / (max - min);

      $('<span>', {
        class: 'lrs__scale-mark',
        text: i,
        style: `${property}: ${(this.slider[length]() - this.runnerFrom[length]()) / 100 * percent}px` }).appendTo(this.scale);
    }

    $('<span>', {
      class: 'lrs__scale-mark',
      text: max,
      style: `${property}: ${this.slider[length]() - this.runnerFrom[length]()}px` }).appendTo(this.scale);
  }
}
