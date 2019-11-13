import EventEmitter from '../../EventEmitter/EventEmitter';
import RunnerView from '../Runner/RunnerView';
import BarView from '../Bar/BarView';
import ScaleView from '../Scale/ScaleView';
import ISliderView from '../../Interfaces/View/ISliderView';
import IFullParameters from '../../Interfaces/IFullParameters';
import sliderTemplateHbs from './sliderTemplate.hbs';

export default class SliderView extends EventEmitter implements ISliderView {
  private $slider: JQuery;
  private runnerFrom: RunnerView;
  private bar: BarView;
  private runnerTo?: RunnerView;
  private scale?: ScaleView;

  constructor($anchorElement: JQuery, parameters: IFullParameters) {
    super();

    $anchorElement.before(sliderTemplateHbs(parameters));
    this.$slider = $anchorElement.prev();

    this.init(parameters);
  }

  updateSlider(parameters: IFullParameters): void {
    const { hasInterval, onChange } = parameters;

    if (parameters.condition === 'updatedOnPercent') this.updateSliderOnMoveRunner(parameters);
    if (parameters.condition === 'updatedOnInteger') this.updateSliderOnUserActivity(parameters);

    if (onChange) onChange(parameters);

    const runnerFromPosition = this.runnerFrom.getPosition();
    const runnerToPosition = hasInterval ? this.runnerTo.getPosition() : null;
    this.bar.update(runnerFromPosition, runnerToPosition);
  }

  private updateSliderOnMoveRunner(parameters: IFullParameters): void {
    const { firstValue, secondValue, firstValuePercent, secondValuePercent,
      hasInterval } = parameters;
    const $movedRunner = this.$slider.find('.lrs__runner_grabbed');

    if (hasInterval) {
      if ($movedRunner.is(this.runnerFrom.getRunner())) {
        this.runnerFrom.update(firstValuePercent, firstValue);
      }

      if ($movedRunner.is(this.runnerTo.getRunner())) {
        this.runnerTo.update(secondValuePercent, secondValue);
      }
    } else this.runnerFrom.update(firstValuePercent, firstValue);
  }

  private updateSliderOnUserActivity(parameters: IFullParameters): void {
    const {firstValue, firstValuePercent, secondValue, secondValuePercent,
      hasInterval, hasScale, hasTip} = parameters;

    const isNeedToReinit =
      (this.runnerTo && !hasInterval) || (!this.runnerTo && hasInterval)
      || (!this.scale && hasScale) || (this.scale && !hasScale)
      || (this.$slider.find('.lrs__tip').length && !hasTip)
      || (!this.$slider.find('.lrs__tip').length && hasTip);
    if (isNeedToReinit) this.reinit(parameters);

    this.updateDirection(parameters);
    this.updateTheme(parameters);
    this.runnerFrom.update(firstValuePercent, firstValue);
    if (hasInterval) this.runnerTo.update(secondValuePercent, secondValue);
    if (hasScale) this.scale.update(parameters);
  }

  private init(parameters: IFullParameters): void {
    const { hasInterval, hasScale } = parameters;

    this.runnerFrom = new RunnerView(this.$slider, parameters);
    this.bar = new BarView(this.$slider);
    if (hasInterval) this.runnerTo = new RunnerView(this.$slider, parameters);
    if (hasScale) this.scale = new ScaleView(this.$slider);

    this.subscribeToUpdates(parameters);
    this.updateSlider(parameters);
  }

  private subscribeToUpdates(parameters: IFullParameters): void {
    const { hasInterval, hasScale } = parameters;

    this.runnerFrom.subscribe('moveRunner', this.handleRunnerMove);
    if (hasInterval) this.runnerTo.subscribe('moveRunner', this.handleRunnerMove);
    if (hasScale) this.scale.subscribe('clickOnScale', this.handleScaleClick);

    $(window).on('resize', () => this.notify('windowResize'));
  }

  private reinit(parameters: IFullParameters): void {
    this.$slider.text('');
    delete this.runnerFrom;
    delete this.runnerTo;
    delete this.bar;
    delete this.scale;
    this.init(parameters);
  }

  private handleRunnerMove = ({ runnerPosition, $runner }): void => {
    const position = this.correctExtremeRunnerPositions($runner, runnerPosition);
    const metric = this.$slider.hasClass('lrs_direction_vertical') ? 'outerHeight' : 'outerWidth';
    const positionPercent = (position * 100) / (this.$slider[metric]() - $runner[metric]());
    const updatedValue = $runner.is(this.runnerFrom.getRunner()) ? 'firstValue' : 'secondValue';

    if (this.runnerTo) this.correctZAxis($runner);

    this.notify('interactWithRunner', {
      updatedValue,
      [$runner.is(this.runnerFrom.getRunner()) ? 'firstValue' : 'secondValue']: positionPercent,
    });
  }

  private handleScaleClick = ({ position, value }): void => {
    if (this.runnerTo) {
      const runnerFromPosition = this.runnerFrom.getPosition();
      const runnerToPosition = this.runnerTo.getPosition();
      const isFirstValueNearer =
         (Math.max(runnerFromPosition, position) - Math.min(runnerFromPosition, position))
         < (Math.max(runnerToPosition, position) - Math.min(runnerToPosition, position));
      if (isFirstValueNearer) this.notify('interactWithScale', { firstValue: value });
      else this.notify('interactWithScale', { secondValue: value });
    } else this.notify('interactWithScale', { firstValue: value });
  }

  private correctExtremeRunnerPositions($runner: JQuery, position: number): number {
    const isVertical = this.$slider.hasClass('lrs_direction_vertical');
    const metric = isVertical ? 'outerHeight' : 'outerWidth';
    const minPosition = $runner.is(this.runnerFrom.getRunner())
      ? 0 : this.runnerFrom.getPosition();
    const maxPosition = $runner.is(this.runnerFrom.getRunner())
      ? (this.runnerTo
          ? this.runnerTo.getPosition() : this.$slider[metric]() - $runner[metric]())
      : this.$slider[metric]() - $runner[metric]();

    return position < minPosition ? minPosition : position > maxPosition ? maxPosition : position;
  }

  private correctZAxis($runner: JQuery): void {
    this.runnerFrom.getRunner().removeClass('lrs__runner_last-grabbed');
    this.runnerTo.getRunner().removeClass('lrs__runner_last-grabbed');

    $runner.addClass('lrs__runner_last-grabbed');
  }

  private updateTheme({ theme }: IFullParameters): void {
    this.$slider.addClass(`lrs_theme_${theme}`).removeClass(`lrs_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
  }

  private updateDirection({ isVertical }: IFullParameters): void {
    if (isVertical) this.$slider.addClass('lrs_direction_vertical');
    if (!isVertical) this.$slider.removeClass('lrs_direction_vertical');
  }
}
