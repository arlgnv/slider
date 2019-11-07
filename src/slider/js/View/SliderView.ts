import EventEmitter from '../EventEmitter/EventEmitter';
import ISliderView from '../Interfaces/View/ISliderView';
import IParameters from '../Interfaces/IParameters';
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

  constructor(anchorElement: JQuery, parameters: IParameters) {
    super();

    this.anchorElement = anchorElement;

    this.init(parameters);
  }

  updateSlider(parameters: IParameters): void {
    switch (parameters.condition) {
      case 'afterUpdateState':
        this.updateSliderInCaseUserActivity(parameters);
        break;
      case 'afterUpdatePercent':
        this.updateSliderInCaseMoveRunner(parameters);
        break;
      case 'afterUpdateSingleValue':
        this.updateSliderInCaseClickScale(parameters);
        break;
      default: break;
    }
  }

  private updateSliderInCaseUserActivity(parameters: IParameters): void {
    const { firstValue, firstValuePercent, secondValue, secondValuePercent,
      hasTip, hasScale, hasInterval, onChange } = parameters;

    if (onChange) onChange(parameters);
    this.reinit(parameters);
    this.updateDirection(parameters);
    this.updateTheme(parameters);
    if (hasScale) this.updateScale(parameters);
    this.updateRunner(this.runnerFrom, firstValuePercent);
    if (hasInterval) this.updateRunner(this.runnerTo, secondValuePercent);
    if (hasTip) this.updateTip(this.tipFrom, firstValue);
    if (hasTip && hasInterval) this.updateTip(this.tipTo, secondValue);
    this.updateBar(parameters);
  }

  private updateSliderInCaseMoveRunner(parameters: IParameters): void {
    const { firstValue, firstValuePercent, secondValue, secondValuePercent,
      hasTip, onChange } = parameters;
    const $runner = this.slider.find('.lrs__runner_grabbed');
    const valuePercent = $runner.is(this.runnerFrom) ? firstValuePercent : secondValuePercent;

    this.updateRunner($runner, valuePercent);
    if (hasTip) {
      const tipText = $runner.is(this.runnerFrom) ? firstValue : secondValue;
      this.updateTip($runner.find('.lrs__tip'), tipText);
    }
    this.updateBar(parameters);
    if (onChange) onChange(parameters);
  }

  private updateSliderInCaseClickScale(parameters: IParameters): void {
    const { firstValue, firstValuePercent, secondValue, secondValuePercent,
      hasInterval, hasTip, onChange } = parameters;

    this.updateRunner(this.runnerFrom, firstValuePercent);
    if (hasInterval) this.updateRunner(this.runnerTo, secondValuePercent);
    if (hasTip) this.updateTip(this.tipFrom, firstValue);
    if (hasTip && hasInterval) this.updateTip(this.tipTo, secondValue);
    this.updateBar(parameters);
    if (onChange) onChange(parameters);
  }

  private init(parameters: IParameters): void {
    this.drawView(parameters);
    this.findDOMElements(parameters);
    this.addEventListeners();
    this.updateSlider(parameters);
  }

  private reinit({ hasTip, hasInterval, hasScale }: IParameters): void {
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
      this.runnerFrom.append('<span class="lrs__tip"></span>');

      this.tipFrom = this.runnerFrom.find(':first-child');
    }

    const isNeedToHideTipFrom = this.tipFrom && !hasTip;
    if (isNeedToHideTipFrom) {
      this.tipFrom.remove();

      delete this.tipFrom;
    }

    const isNeedToShowTipTo = !this.tipTo && hasTip && hasInterval;
    if (isNeedToShowTipTo) {
      this.runnerTo.append('<span class="lrs__tip"></span>');

      this.tipTo = this.runnerTo.find(':first-child');
    }

    const isNeedToHideTipTo = (this.tipTo && !hasTip) || (this.tipTo && !hasInterval);
    if (isNeedToHideTipTo) {
      this.tipTo.remove();

      delete this.tipTo;
    }

    const isNeedToShowScale = !this.scale && hasScale;
    if (isNeedToShowScale) {
      this.slider.append('<span class="lrs__scale"></span>');

      this.scale = this.slider.find('.lrs__scale');
      this.scale.on('click', this.handleScaleClick.bind(this));
    }

    const isNeedToHideScale = this.scale && !hasScale;
    if (isNeedToHideScale) {
      this.scale.remove();

      delete this.scale;
    }
  }

  private drawView(parameters: IParameters): void {
    this.anchorElement.before(sliderTemplateHbs(parameters));
  }

  private findDOMElements({ hasInterval, hasScale, hasTip }: IParameters): void {
    this.slider = this.anchorElement.prev();
    this.runnerFrom = this.slider.find('.lrs__runner').first();
    this.bar = this.slider.find('.lrs__bar');
    if (hasScale) this.scale = this.slider.find('.lrs__scale');
    if (hasInterval) this.runnerTo = this.slider.find('.lrs__runner').last();
    if (hasTip) this.tipFrom = this.runnerFrom.find('.lrs__tip');
    if (hasTip && hasInterval) this.tipTo = this.runnerTo.find('.lrs__tip');
  }

  private addEventListeners(): void {
    this.runnerFrom.on('mousedown', this.handleRunnerMouseDown.bind(this));

    if (this.runnerTo) this.runnerTo.on('mousedown', this.handleRunnerMouseDown.bind(this));
    if (this.scale) this.scale.on('click', this.handleScaleClick.bind(this));

    $(window).on('resize', () => this.notify('windowResize'));
  }

  private handleRunnerMouseDown(evt: JQuery.MouseDownEvent): void {
    const $runner: JQuery = $(evt.currentTarget).addClass('lrs__runner_grabbed');
    const cursorPosition = this.getCursorPosition($runner, evt.clientX, evt.clientY);
    const metric = this.slider.hasClass('lrs_direction_vertical') ? 'outerHeight' : 'outerWidth';

    if (this.runnerTo) this.correctZAxis($runner);

    const handleWindowMouseMove = (event: JQuery.Event): void => {
      let runnerPosition = this.getRunnerShift(cursorPosition, event.clientX, event.clientY);
      runnerPosition = this.correctExtremeRunnerPositions($runner, runnerPosition);

      this.notify('moveRunner', {
        [$runner.is(this.runnerFrom) ? 'firstPositionPercent' : 'secondPositionPercent']:
        (runnerPosition * 100) / (this.slider[metric]() - $runner[metric]()),
      });
    };

    const handleWindowMouseUp = (): void => {
      $runner.removeClass('lrs__runner_grabbed');

      $(window).off('mousemove', handleWindowMouseMove).off('mouseup', handleWindowMouseUp);
    };

    $(window).on('mousemove', handleWindowMouseMove).on('mouseup', handleWindowMouseUp);
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
    const property = this.slider.hasClass('lrs_direction_vertical') ? 'bottom' : 'left';
    const metric = this.slider.hasClass('lrs_direction_vertical') ? 'outerHeight' : 'outerWidth';
    const minPosition = $runner.is(this.runnerFrom) ? 0 : parseFloat(this.runnerFrom.css(property));
    const maxPosition = $runner.is(this.runnerFrom)
      ? (this.runnerTo
          ? parseFloat(this.runnerTo.css(property))
          : this.slider[metric]() - $runner[metric]())
      : this.slider[metric]() - $runner[metric]();

    return position < minPosition ? minPosition : position > maxPosition ? maxPosition : position;
  }

  private correctZAxis($runner: JQuery): void {
    this.runnerFrom.removeClass('lrs__runner_last-grabbed');
    this.runnerTo.removeClass('lrs__runner_last-grabbed');

    $runner.addClass('lrs__runner_last-grabbed');
  }

  private updateRunner($runner: JQuery, valuePercent: number): void {
    const isVertical = this.slider.hasClass('lrs_direction_vertical');
    const sliderSize = isVertical ? this.slider.outerHeight() : this.slider.outerWidth();
    const runnerSize = isVertical ? $runner.outerHeight() : $runner.outerWidth();
    const runnerOffset = ((sliderSize - runnerSize) * valuePercent) / 100;

    $runner.attr('style', `${isVertical ? 'bottom' : 'left'}: ${runnerOffset}px`);
  }

  private updateTip($tip: JQuery, value: number): void {
    $tip.text(value);
  }

  private updateBar({ hasInterval, isVertical }: IParameters): void {
    const property = isVertical ? 'bottom' : 'left';
    const metric = isVertical ? 'outerHeight' : 'outerWidth';
    const leftEdge = hasInterval ? parseFloat(this.runnerFrom.css(property)) : 0;
    const rightEdge = hasInterval
      ? this.slider[metric]() - parseFloat(this.runnerTo.css(property))
      : this.slider[metric]() - parseFloat(this.runnerFrom.css(property));

    this.bar.attr('style', isVertical ? `bottom: ${leftEdge}px; top: ${rightEdge}px;` : `left: ${leftEdge}px; right: ${rightEdge}px;`);
  }

  private updateTheme({ theme }: IParameters): void {
    this.slider.addClass(`lrs_theme_${theme}`).removeClass(`lrs_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
  }

  private updateDirection({ isVertical }: IParameters): void {
    if (isVertical) this.slider.addClass('lrs_direction_vertical');
    if (!isVertical) this.slider.removeClass('lrs_direction_vertical');
  }

  private updateScale({ min, max, step, isVertical }: IParameters): void {
    this.scale.text('');

    const property = isVertical ? 'bottom' : 'left';
    const metric = isVertical ? 'outerHeight' : 'outerWidth';

    $('<span>', { class: 'lrs__scale-mark',
      text: min, style: `${property}: 0px` }).appendTo(this.scale);

    for (let i: number = min + step; i < max; i += step) {
      const percent = ((i - min) * 100) / (max - min);

      $('<span>', {
        class: 'lrs__scale-mark',
        text: i,
        style: `${property}: ${(this.slider[metric]() - this.runnerFrom[metric]()) / 100 * percent}px` }).appendTo(this.scale);
    }

    $('<span>', {
      class: 'lrs__scale-mark', text: max,
      style: `${property}: ${this.slider[metric]() -
        this.runnerFrom[metric]()}px` }).appendTo(this.scale);
  }
}
