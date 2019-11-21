import Observer from '../../Observer/Observer';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import runnerTemplateHbs from './runnerTemplate.hbs';

export default class RunnerView extends Observer {
  private $slider: JQuery;
  private $runner: JQuery;
  private $tip: JQuery;
  private runnerType: 'first' | 'second';
  private positionPercent: number;
  private value?: number;

  constructor($slider: JQuery, parameters: IDefaultParameters, runnerType: 'first' | 'second') {
    super();

    this.init($slider, parameters, runnerType);
  }

  update(parameters: IDefaultParameters): void {
    this.positionPercent = parameters[`${this.runnerType}ValuePercent`];

    const isVertical = this.$slider.hasClass('range-slider_direction_vertical');
    this.$runner.attr('style', `${isVertical ? 'bottom' : 'left'}: ${this.positionPercent}%`);

    if (this.$tip) {
      this.value = parameters[`${this.runnerType}Value`];
      this.$tip.text(this.value);
    }
  }

  getPositionPercent(): number {
    return this.positionPercent;
  }

  getRunner(): JQuery {
    return this.$runner;
  }

  private init($slider: JQuery, parameters: IDefaultParameters, runnerType: 'first' | 'second'):
  void {
    this.$slider = $slider;
    this.$runner = $(runnerTemplateHbs(parameters));
    this.runnerType = runnerType;
    this.positionPercent = runnerType === 'first'
      ? parameters.firstValuePercent : parameters.secondValuePercent;
    if (parameters.hasTip) this.$tip = this.$runner.find('.range-slider__tip');
    this.addEventListeners();

    this.$slider.append(this.$runner);
    this.update(parameters);
  }

  private addEventListeners(): void {
    this.$runner.on('mousedown', this.handleRunnerMouseDown);
  }

  private handleRunnerMouseDown = (evt: JQuery.MouseDownEvent): void => {
    const $runner: JQuery = $(evt.currentTarget).addClass('range-slider__runner_grabbed');
    const cursorPosition = this.getCursorPosition($runner, evt.clientX, evt.clientY);
    const metric = this.$slider.hasClass('range-slider_direction_vertical') ? 'outerHeight' : 'outerWidth';

    this.$slider.find('.range-slider__runner').each(function () {
      $(this).removeClass('range-slider__runner_type_last-grabbed');
    });
    $runner.addClass('range-slider__runner_type_last-grabbed');

    const handleWindowMouseMove = (e: JQuery.Event): void => {
      const runnerShift = this.getRunnerShift(cursorPosition, e.clientX, e.clientY);
      const runnerShiftPercent = (runnerShift * 100) / this.$slider[metric]();

      this.notify('moveRunner', { runnerShiftPercent, runnerType: this.runnerType });
    };

    const handleWindowMouseUp = (): void => {
      $runner.removeClass('range-slider__runner_grabbed');

      $(window).off('mousemove', handleWindowMouseMove).off('mouseup', handleWindowMouseUp);
    };

    $(window).on('mousemove', handleWindowMouseMove).on('mouseup', handleWindowMouseUp);
  }

  private getCursorPosition($target: JQuery, clientX: number, clientY: number): number {
    return this.$slider.hasClass('range-slider_direction_vertical')
      ? clientY + (parseFloat($target.css('bottom')) || 0) : clientX - (parseFloat($target.css('left')) || 0);
  }

  private getRunnerShift(position: number, clientX: number, clientY: number): number {
    return this.$slider.hasClass('range-slider_direction_vertical')
      ? position - clientY : clientX - position;
  }
}
