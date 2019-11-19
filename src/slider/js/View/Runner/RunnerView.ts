import Observer from '../../Observer/Observer';
import IFullParameters from '../../Interfaces/IFullParameters';
import runnerTemplateHbs from './runnerTemplate.hbs';

export default class RunnerView extends Observer {
  private $slider: JQuery;
  private $runner: JQuery;
  private $tip: JQuery;
  private runnerType: 'first' | 'second';
  private positionPercent: number;
  private value?: number;

  constructor($slider: JQuery, parameters: IFullParameters, runnerType: 'first' | 'second') {
    super();

    this.init($slider, parameters, runnerType);
  }

  update(parameters: IFullParameters): void {
    this.positionPercent = parameters[`${this.runnerType}ValuePercent`];

    const isVertical = this.$slider.hasClass('lrs_direction_vertical');
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

  private init($slider: JQuery, parameters: IFullParameters, runnerType: 'first' | 'second'): void {
    this.$slider = $slider;
    this.$runner = $(runnerTemplateHbs(parameters));
    this.runnerType = runnerType;
    this.positionPercent = runnerType === 'first'
      ? parameters.firstValuePercent : parameters.secondValuePercent;
    if (parameters.hasTip) this.$tip = this.$runner.find('.lrs__tip');
    this.addEventListeners();

    this.$slider.append(this.$runner);
    this.update(parameters);
  }

  private addEventListeners(): void {
    this.$runner.on('mousedown', this.handleRunnerMouseDown);
  }

  private handleRunnerMouseDown = (evt: JQuery.MouseDownEvent): void => {
    const $runner: JQuery = $(evt.currentTarget).addClass('lrs__runner_grabbed');
    const cursorPosition = this.getCursorPosition($runner, evt.clientX, evt.clientY);
    const metric = this.$slider.hasClass('lrs_direction_vertical') ? 'outerHeight' : 'outerWidth';
    const maxRunnerPosition = this.$slider[metric]();

    this.$slider.find('.lrs__runner').each(function () {
      $(this).removeClass('lrs__runner_last-grabbed');
    });
    $runner.addClass('lrs__runner_last-grabbed');

    const handleWindowMouseMove = (e: JQuery.Event): void => {
      let runnerShift = this.getRunnerShift(cursorPosition, e.clientX, e.clientY);
      if (runnerShift < 0) runnerShift = 0;
      if (runnerShift > maxRunnerPosition) runnerShift = maxRunnerPosition;

      const runnerShiftPercent = Math.round((runnerShift * 100) / this.$slider[metric]());
      this.notify('moveRunner', { runnerShiftPercent, runnerType: this.runnerType });
    };

    const handleWindowMouseUp = (): void => {
      $runner.removeClass('lrs__runner_grabbed');

      $(window).off('mousemove', handleWindowMouseMove).off('mouseup', handleWindowMouseUp);
    };

    $(window).on('mousemove', handleWindowMouseMove).on('mouseup', handleWindowMouseUp);
  }

  private getCursorPosition($target: JQuery, clientX: number, clientY: number): number {
    return this.$slider.hasClass('lrs_direction_vertical')
      ? clientY + (parseFloat($target.css('bottom')) || 0) : clientX - (parseFloat($target.css('left')) || 0);
  }

  private getRunnerShift(position: number, clientX: number, clientY: number): number {
    return this.$slider.hasClass('lrs_direction_vertical') ? position - clientY :clientX - position;
  }
}
