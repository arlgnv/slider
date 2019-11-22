import Observer from '../../Observer/Observer';
import RunnerView from '../Runner/RunnerView';
import ProgressBar from '../ProgressBar/ProgressBar';
import ScaleView from '../Scale/ScaleView';
import ISliderView from '../../Interfaces/View/Slider/ISliderView';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import sliderTemplateHbs from './sliderTemplate.hbs';

export default class SliderView extends Observer implements ISliderView {
  private $anchorElement: JQuery;
  private $slider: JQuery;
  private runnerFrom: RunnerView;
  private progressBar: ProgressBar;
  private runnerTo?: RunnerView;
  private scale?: ScaleView;

  constructor($anchorElement: JQuery, parameters: IDefaultParameters) {
    super();

    this.initSlider(parameters, $anchorElement);
  }

  updateSlider(parameters: IDefaultParameters): void {
    const { kind, onChange } = parameters;

    if (kind === 'stateUpdated') this.reinit(parameters);

    if (kind === 'valuePercentUpdated') {
      const { lastUpdatedOnPercent, firstValuePercent, secondValuePercent } = parameters;

      if (lastUpdatedOnPercent === 'firstValue') this.runnerFrom.updateRunner(parameters);
      if (lastUpdatedOnPercent === 'secondValue') this.runnerTo.updateRunner(parameters);

      this.progressBar.updateProgressBar(firstValuePercent, secondValuePercent);
    }

    if (onChange) onChange(parameters);
  }

  private initSlider(parameters: IDefaultParameters, $anchorElement?: JQuery): void {
    if ($anchorElement) {
      this.$anchorElement = $anchorElement;
      $anchorElement.before(sliderTemplateHbs(parameters));
      this.$slider = $anchorElement.prev();
    }

    this.updateDirection(parameters);
    this.updateTheme(parameters);

    const { hasInterval, hasScale, onChange } = parameters;
    this.runnerFrom = new RunnerView(this.$slider, parameters, 'first');
    this.progressBar = new ProgressBar(this.$slider, parameters);
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
    this.runnerFrom = undefined;
    this.runnerTo = undefined;
    this.progressBar = undefined;
    this.scale = undefined;
    this.initSlider(parameters);
  }

  private handleRunnerMove = ({ runnerShiftPercent, runnerType }): void => {
    const lastUpdatedOnPercent = `${runnerType}Value`;

    this.notify('dispatchedParameters', { lastUpdatedOnPercent, percent: runnerShiftPercent });
  }

  private handleScaleClick = ({ positionPercent }): void => {
    if (this.runnerTo) {
      const runnerFromPosition = this.runnerFrom.getPositionPercent();
      const runnerToPosition = this.runnerTo.getPositionPercent();

      if (runnerFromPosition === runnerToPosition) {
        const lastUpdatedOnPercent = positionPercent < runnerFromPosition ? 'firstValue' : 'secondValue';

        this.notify('dispatchedParameters', { lastUpdatedOnPercent, percent: positionPercent });
      } else {
        const isFirstValueNearer = Math.abs(positionPercent - this.runnerFrom.getPositionPercent())
        <= Math.abs(positionPercent - this.runnerTo.getPositionPercent());

        const lastUpdatedOnPercent = isFirstValueNearer ? 'firstValue' : 'secondValue';

        this.notify('dispatchedParameters', { lastUpdatedOnPercent, percent: positionPercent });
      }
    } else {
      const lastUpdatedOnPercent = 'firstValue';

      this.notify('dispatchedParameters', { lastUpdatedOnPercent, percent: positionPercent });
    }
  }

  private updateTheme({ theme }: IDefaultParameters): void {
    this.$slider
      .addClass(`range-slider_theme_${theme}`)
      .removeClass(`range-slider_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
  }

  private updateDirection({ isVertical }: IDefaultParameters): void {
    if (isVertical) this.$slider.addClass('range-slider_direction_vertical');
    if (!isVertical) this.$slider.removeClass('range-slider_direction_vertical');
  }
}
