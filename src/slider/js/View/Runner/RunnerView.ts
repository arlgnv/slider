import EventEmitter from '../../EventEmitter/EventEmitter';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import runnerTemplateHbs from './runnerTemplate.hbs';

export default class RunnerView extends EventEmitter {
  private $slider: JQuery;
  private $runner: JQuery;
  private $tip: JQuery;

  constructor($slider: JQuery, parameters: IDefaultParameters) {
    super();

    this.init($slider, parameters);
  }

  update(positionPercent: number, value?: number): void {
    const isVertical = this.$slider.hasClass('lrs_direction_vertical');
    const sliderSize = isVertical ? this.$slider.outerHeight() : this.$slider.outerWidth();
    const runnerSize = isVertical ? this.$runner.outerHeight() : this.$runner.outerWidth();
    const property = isVertical ? 'bottom' : 'left';
    const runnerOffset = ((sliderSize - runnerSize) * positionPercent) / 100;

    this.$runner.attr('style', `${property}: ${runnerOffset}px`);

    if (this.$tip) this.$tip.text(value);
  }

  getPosition(): number {
    return this.$slider.hasClass('lrs_direction_vertical')
      ? parseFloat(this.$runner.css('bottom')) : parseFloat(this.$runner.css('left'));
  }

  getRunner(): JQuery {
    return this.$runner;
  }

  private init($slider: JQuery, parameters: IDefaultParameters): void {
    this.$slider = $slider;
    this.$runner = $(runnerTemplateHbs(parameters));
    this.$runner.on('mousedown', this.handleRunnerMouseDown);
    if (parameters.hasTip) this.$tip = this.$runner.find('.lrs__tip');

    this.$slider.append(this.$runner);
    this.$runner.on('mousedown', this.handleRunnerMouseDown);
  }

  private handleRunnerMouseDown = (evt: JQuery.MouseDownEvent): void => {
    const $runner: JQuery = $(evt.currentTarget).addClass('lrs__runner_grabbed');
    const cursorPosition = this.getCursorPosition($runner, evt.clientX, evt.clientY);

    const handleWindowMouseMove = (event: JQuery.Event): void => {
      const runnerPosition = this.getRunnerShift(cursorPosition, event.clientX, event.clientY);

      this.notify('moveRunner', { runnerPosition, $runner: this.$runner });
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
    return this.$slider.hasClass('lrs_direction_vertical')
      ? position - clientY : clientX - position;
  }
}
