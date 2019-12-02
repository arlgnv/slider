import Observer from '../../Observer/Observer';
import Runner from '../Runner/Runner';
import ProgressBar from '../ProgressBar/ProgressBar';
import Scale from '../Scale/Scale';
import ISlider from '../../Interfaces/View/Slider/ISlider';
import { IDefaultParameters, IPercentParameters } from '../../Interfaces/Model/IModel';
import sliderTemplateHbs, * as template from './sliderTemplate.hbs';
const templateFunction = sliderTemplateHbs || template;

export default class Slider extends Observer implements ISlider {
  private $slider: JQuery;
  private runnerFrom: Runner;
  private progressBar: ProgressBar;
  private runnerTo?: Runner;
  private scale?: Scale;

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
      $anchorElement.before($(templateFunction(parameters)));
      this.$slider = $anchorElement.prev();
    }

    this.updateDirection(parameters);
    this.updateTheme(parameters);

    const { hasInterval, hasScale, onChange } = parameters;
    this.runnerFrom = new Runner(this.$slider, parameters, 'firstValue');
    this.progressBar = new ProgressBar(this.$slider, parameters);
    if (hasInterval) {
      this.runnerTo = new Runner(this.$slider, parameters, 'secondValue');
    }
    if (hasScale) {
      this.scale = new Scale(this.$slider, parameters);
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
    const oldClassName = theme === 'aqua' 
      ? 'range-slider_theme_red js-range-slider_theme_red'
      : 'range-slider_theme_aqua js-range-slider_theme_aqua';
    const newClassName = `range-slider_theme_${theme} js-range-slider_theme_${theme}`;

    this.$slider.addClass(newClassName).removeClass(oldClassName);
  }

  private updateDirection({ isVertical }: IDefaultParameters): void {
    if (isVertical) {
      this.$slider.addClass('range-slider_direction_vertical js-range-slider_direction_vertical');
    } else {
      this.$slider.removeClass('range-slider_direction_vertical js-range-slider_direction_vertical');
    }
  }
}
