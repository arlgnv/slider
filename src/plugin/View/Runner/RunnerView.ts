import Observer from '../../Observer/Observer';
import IRunnerView from '../../Interfaces/View/Runner/IRunnerView';
import TipView from '../Tip/TipView';
import IDefaultParameters from '../../Model/IDefaultParameters';
import { PERCENT_MIN, PERCENT_MAX } from '../../constants';
import runnerTemplateHbs, * as template from './runnerTemplate.hbs';
const templateFunction = runnerTemplateHbs || template;

export default class RunnerView extends Observer implements IRunnerView {
  private $slider: JQuery;
  private $runner: JQuery;
  private tip: TipView;
  private runnerType: 'firstValue' | 'secondValue';

  constructor($slider: JQuery, parameters: IDefaultParameters, runnerType: 'firstValue' | 'secondValue') {
    super();

    this.initRunner($slider, parameters, runnerType);
  }

  public updateRunner(parameters: IDefaultParameters): void {
    const {isVertical, hasTip} = parameters;
    const position = parameters[`${this.runnerType}Percent`];
    this.$runner.attr('style', `${isVertical ? 'bottom' : 'left'}: ${position}%`);

    if (hasTip) {
      this.tip.updateTip(parameters[this.runnerType]);
    }
  }

  private initRunner(
      $slider: JQuery, parameters: IDefaultParameters, runnerType: 'firstValue' | 'secondValue',
    ): void {
    this.$slider = $slider;
    this.$runner = $(templateFunction(parameters));
    this.runnerType = runnerType;

    if (parameters.hasTip) {
      this.tip = new TipView(this.$runner, parameters[this.runnerType]);
    }

    this.addEventListeners();

    this.$slider.append(this.$runner);
    this.updateRunner(parameters);
  }

  private addEventListeners(): void {
    this.$runner.on('mousedown', this.handleRunnerMouseDown);
  }

  private handleRunnerMouseDown = (evt: JQuery.MouseDownEvent): void => {
    const $runner: JQuery = $(evt.currentTarget).addClass('range-slider__runner_grabbed js-range-slider__runner_grabbed');
    const cursorPosition = this.getCursorPosition($runner, evt.clientX, evt.clientY);
    const metric = this.$slider.hasClass('js-range-slider_direction_vertical') ? 'outerHeight' : 'outerWidth';

    this.$slider.find('.js-range-slider__runner_type_last-grabbed').each(function () {
      $(this).removeClass('range-slider__runner_type_last-grabbed js-range-slider__runner_type_last-grabbed');
    });
    $runner.addClass('range-slider__runner_type_last-grabbed js-range-slider__runner_type_last-grabbed');

    const handleWindowMouseMove = (e: JQuery.Event): void => {
      const runnerShift = this.getRunnerShift(cursorPosition, e.clientX, e.clientY);
      const runnerShiftPercent = runnerShift * PERCENT_MAX / this.$slider[metric]();

      this.notify('movedRunner', {
        percent: runnerShiftPercent,
        lastUpdatedOnPercent: this.runnerType,
      });
    };

    const handleWindowMouseUp = (): void => {
      $runner.removeClass('range-slider__runner_grabbed js-range-slider__runner_grabbed');

      $(window).off('mousemove', handleWindowMouseMove).off('mouseup', handleWindowMouseUp);
    };

    $(window).on('mousemove', handleWindowMouseMove).on('mouseup', handleWindowMouseUp);
  }

  private getCursorPosition($target: JQuery, clientX: number, clientY: number): number {
    return this.$slider.hasClass('range-slider_direction_vertical')
      ? clientY + (parseFloat($target.css('bottom')) || PERCENT_MIN)
      : clientX - (parseFloat($target.css('left')) || PERCENT_MIN);
  }

  private getRunnerShift(position: number, clientX: number, clientY: number): number {
    return this.$slider.hasClass('range-slider_direction_vertical')
      ? position - clientY : clientX - position;
  }
}
