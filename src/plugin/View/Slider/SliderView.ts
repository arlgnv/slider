import Observer from '../../Observer/Observer';
import RunnerView from '../Runner/RunnerView';
import ProgressBar from '../ProgressBar/ProgressBar';
import ScaleView from '../Scale/ScaleView';
import ISliderView from '../../Interfaces/View/Slider/ISliderView';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import IPercentParameters from '../../Interfaces/IPercentParameters';
import sliderTemplateHbs from './sliderTemplate.hbs';

export default class SliderView extends Observer implements ISliderView {
  private $slider: JQuery;
  private runnerFrom: RunnerView;
  private progressBar: ProgressBar;
  private runnerTo?: RunnerView;
  private scale?: ScaleView;

  constructor($anchorElement: JQuery, parameters: IDefaultParameters) {
    super();

    this.initSlider(parameters, $anchorElement);
  }

  public updateSlider(parameters: IDefaultParameters): void {
    const { kind, onChange } = parameters;

    if (onChange) {
      onChange(parameters);
    }

    if (kind === 'valuePercentUpdated') {
      const { firstValuePercent, secondValuePercent, hasInterval } = parameters;

      this.runnerFrom.updateRunner(parameters);
      this.progressBar.updateProgressBar(firstValuePercent, secondValuePercent);

      if (hasInterval) {
        this.runnerTo.updateRunner(parameters);
      }
    }

    if (kind === 'stateUpdated') {
      this.redrawSlider(parameters);
    }
  }

  private initSlider(parameters: IDefaultParameters, $anchorElement?: JQuery): void {
    if ($anchorElement) {
      $anchorElement.before(sliderTemplateHbs(parameters));
      this.$slider = $anchorElement.prev();
    }

    this.updateDirection(parameters);
    this.updateTheme(parameters);

    const { hasInterval, hasScale, onChange } = parameters;
    this.runnerFrom = new RunnerView(this.$slider, parameters, 'firstValue');
    this.progressBar = new ProgressBar(this.$slider, parameters);
    if (hasInterval) {
      this.runnerTo = new RunnerView(this.$slider, parameters, 'secondValue');
    }
    if (hasScale) {
      this.scale = new ScaleView(this.$slider, parameters);
    }
    if (onChange) {
      onChange(parameters);
    }

    this.initSubscribes(parameters);
  }

  private initSubscribes(parameters: IDefaultParameters): void {
    const { hasInterval, hasScale } = parameters;

    this.runnerFrom.subscribe('movedRunner', this.handleRunnerMove);

    if (hasInterval) {
      this.runnerTo.subscribe('movedRunner', this.handleRunnerMove);
    }

    if (hasScale) {
      this.scale.subscribe('selectedValue', this.handleScaleClick);
    }
  }

  private redrawSlider(parameters: IDefaultParameters): void {
    this.$slider.text('');
    this.runnerFrom = undefined;
    this.runnerTo = undefined;
    this.progressBar = undefined;
    this.scale = undefined;
    this.initSlider(parameters);
  }

  private handleRunnerMove = (parameters: IPercentParameters): void => {
    this.notify('dispatchedParameters', parameters);
  }

  private handleScaleClick = (parameters: IPercentParameters): void => {
    this.notify('dispatchedParameters', parameters);
  }

  private updateTheme({ theme }: IDefaultParameters): void {
    this.$slider
      .addClass(`range-slider_theme_${theme}`)
      .removeClass(`range-slider_theme_${theme === 'aqua' ? 'red' : 'aqua'}`);
  }

  private updateDirection({ isVertical }: IDefaultParameters): void {
    if (isVertical) {
      this.$slider.addClass('range-slider_direction_vertical');
    } else {
      this.$slider.removeClass('range-slider_direction_vertical');
    }
  }
}
