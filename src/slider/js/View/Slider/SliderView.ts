import EventEmitter from '../../EventEmitter/EventEmitter';
import RunnerView from '../Runner/RunnerView';
import BarView from '../Bar/BarView';
import ScaleView from '../Scale/ScaleView';
import ISliderView from '../../Interfaces/View/ISliderView';
import IParameters from '../../Interfaces/IParameters';
import sliderTemplateHbs from './sliderTemplate.hbs';

export default class SliderView extends EventEmitter implements ISliderView {
  private $slider: JQuery;
  private runnerFrom: RunnerView;
  private bar: BarView;
  private runnerTo?: RunnerView;
  private scale?: ScaleView;

  constructor($anchorElement: JQuery, parameters: IParameters) {
    super();

    $anchorElement.before(sliderTemplateHbs(parameters));
    this.$slider = $anchorElement.prev();

    this.init(parameters);
  }

  updateSlider(parameters: IParameters): void {
    const { firstValue, firstValuePercent, secondValue, secondValuePercent,
      hasTip, hasScale, hasInterval, onChange, isVertical } = parameters;

    const $movedRunner = this.$slider.find('.lrs__runner_grabbed');

    if ($movedRunner.length) {
      this.updateRunner($movedRunner,
                        $movedRunner.is(this.runnerFrom) ? firstValuePercent : secondValuePercent);

      if (hasTip) {
        this.updateTip($movedRunner.find('.lrs__tip'),
                       $movedRunner.is(this.runnerFrom) ? firstValue : secondValue);
      }
    } else {
      // this.reinit(parameters);
      this.updateDirection(parameters);
      this.updateTheme(parameters);
      this.runnerFrom.update(firstValuePercent, firstValue);
      if (hasInterval) this.runnerTo.update(secondValuePercent, secondValue);
      if (hasScale) this.scale.update(parameters);
    }

    this.bar.update(parameters);
    if (onChange) onChange(parameters);
  }

  getSliderSize(): number {
    return this.$slider.hasClass('lrs_direction_vertical')
      ? this.$slider.outerHeight() : this.$slider.outerWidth();
  }

  getRunnerFromPosition(): string {
    return this.runnerFrom.getPosition();
  }

  getRunnerToPosition(): string {
    return this.runnerTo.getPosition();
  }

  private init(parameters: IParameters): void {
    const { hasInterval, hasScale } = parameters;

    this.runnerFrom = new RunnerView(this, this.$slider, parameters);
    this.bar = new BarView(this, this.$slider);
    if (hasInterval) this.runnerTo = new RunnerView(this, this.$slider, parameters);
    if (hasScale) this.scale = new ScaleView(this, this.$slider);

    $(window).on('resize', () => this.notify('windowResize'));

    this.updateSlider(parameters);
  }

  private reinit({ hasTip, hasInterval, hasScale }: IParameters): void {
    const isNeedToShowRunnerTo = !this.runnerTo && hasInterval;
    if (isNeedToShowRunnerTo) {
      this.bar.after('<span class="lrs__runner"></span>');

      this.runnerTo = this.bar.next();
      this.runnerTo.on('mousedown', this.handleRunnerMouseDown);
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
      this.scale.on('click', this.handleScaleClick);
    }

    const isNeedToHideScale = this.scale && !hasScale;
    if (isNeedToHideScale) {
      this.scale.remove();

      delete this.scale;
    }
  }

  private handleRunnerMouseDown = (evt: JQuery.MouseDownEvent): void => {
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

  private handleScaleClick = (evt: JQuery.ClickEvent): void => {
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

  private updateTheme({ theme }: IParameters): void {
    this.$slider.addClass(`lrs_theme_${theme}`).removeClass(`lrs_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
  }

  private updateDirection({ isVertical }: IParameters): void {
    if (isVertical) this.$slider.addClass('lrs_direction_vertical');
    if (!isVertical) this.$slider.removeClass('lrs_direction_vertical');
  }
}
