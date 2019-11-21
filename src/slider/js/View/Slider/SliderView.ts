import Observer from '../../Observer/Observer';
import RunnerView from '../Runner/RunnerView';
import ProgressBar from '../ProgressBar/ProgressBar';
import ScaleView from '../Scale/ScaleView';
import ISliderView from '../../Interfaces/View/ISliderView';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import sliderTemplateHbs from './sliderTemplate.hbs';

export default class SliderView extends Observer implements ISliderView {
  private $slider: JQuery;
  private runnerFrom: RunnerView;
  private bar: ProgressBar;
  private runnerTo?: RunnerView;
  private scale?: ScaleView;

  constructor($anchorElement: JQuery, parameters: IDefaultParameters) {
    super();

    this.init(parameters, $anchorElement);
  }

  updateSlider(parameters: IDefaultParameters): void {
    const { kind, onChange } = parameters;

    if (kind === 'valuePercentUpdated') this.updateSliderOnInteract(parameters);
    if (kind === 'stateUpdated') this.reinit(parameters);
    if (onChange) onChange(parameters);
  }

  private updateSliderOnInteract(parameters: IDefaultParameters): void {
    const { lastUpdatedOnPercent, hasInterval } = parameters;

    if (lastUpdatedOnPercent === 'firstValue') this.runnerFrom.update(parameters);
    if (lastUpdatedOnPercent === 'secondValue') this.runnerTo.update(parameters);

    this.bar.update(
      this.runnerFrom.getPositionPercent(),
      hasInterval ? this.runnerTo.getPositionPercent() : null);
  }

  private init(parameters: IDefaultParameters, $anchorElement?: JQuery): void {
    if ($anchorElement) {
      $anchorElement.before(sliderTemplateHbs(parameters));
      this.$slider = $anchorElement.prev();
    }

    this.updateDirection(parameters);
    this.updateTheme(parameters);

    this.runnerFrom = new RunnerView(this.$slider, parameters, 'first');
    this.bar = new ProgressBar(this.$slider, parameters);

    const { hasInterval, hasScale, onChange } = parameters;
    if (hasInterval) this.runnerTo = new RunnerView(this.$slider, parameters, 'second');
    if (hasScale) this.scale = new ScaleView(this.$slider, parameters);
    if (onChange) onChange(parameters);

    this.subscribeToUpdates(parameters);
  }

  private subscribeToUpdates(parameters: IDefaultParameters): void {
    const { hasInterval, hasScale } = parameters;

    this.runnerFrom.subscribe('moveRunner', this.handleRunnerMove);
    if (hasInterval) this.runnerTo.subscribe('moveRunner', this.handleRunnerMove);
    if (hasScale) this.scale.subscribe('clickOnScale', this.handleScaleClick);
  }

  private reinit(parameters: IDefaultParameters): void {
    this.$slider.text('');
    delete this.runnerFrom;
    delete this.runnerTo;
    delete this.bar;
    delete this.scale;
    this.init(parameters);
  }

  private handleRunnerMove = ({ runnerShiftPercent, runnerType }): void => {
    let positionPercent = runnerShiftPercent;

    if (this.runnerTo) {
      if (runnerType === 'first') {
        const maxPosition = this.runnerTo.getPositionPercent();
        positionPercent = positionPercent > maxPosition ? maxPosition : positionPercent;
      }
      if (runnerType === 'second') {
        const minPosition = this.runnerFrom.getPositionPercent();
        positionPercent = positionPercent < minPosition ? minPosition : positionPercent;
      }
    }

    this.notify('dispatchedParameters', {
      lastUpdatedOnPercent: `${runnerType}Value`, percent: positionPercent});
  }

  private handleScaleClick = ({ positionPercent: position }): void => {
    let updatedValue: 'firstValue' | 'secondValue';

    if (this.runnerTo) {
      const runnerFromPosition = this.runnerFrom.getPositionPercent();
      const runnerToPosition = this.runnerTo.getPositionPercent();
      const isFirstValueNearer =
         (Math.max(runnerFromPosition, position) - Math.min(runnerFromPosition, position))
         < (Math.max(runnerToPosition, position) - Math.min(runnerToPosition, position));
      if (isFirstValueNearer) updatedValue = 'firstValue';
      else updatedValue = 'secondValue';
    } else updatedValue = 'firstValue';

    this.notify('dispatchedParameters', {
      lastUpdatedOnPercent: updatedValue, percent: position });
  }

  private updateTheme({ theme }: IDefaultParameters): void {
    this.$slider.addClass(`range-slider_theme_${theme}`).removeClass(`range-slider_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
  }

  private updateDirection({ isVertical }: IDefaultParameters): void {
    if (isVertical) this.$slider.addClass('range-slider_direction_vertical');
    if (!isVertical) this.$slider.removeClass('range-slider_direction_vertical');
  }
}
