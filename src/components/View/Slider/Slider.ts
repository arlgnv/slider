import Observer from '../../Observer/Observer';
import Runner from '../Runner/Runner';
import ProgressBar from '../ProgressBar/ProgressBar';
import Scale from '../Scale/Scale';
import ISlider from '../../Interfaces/View/Slider/ISlider';
import { IDefaultParameters, IPercentParameters } from '../../Interfaces/Model/IModel';
import { PERCENT_MIN, PERCENT_MAX } from '../../constants';
import sliderTemplateHbs, * as template from './slider.template.hbs';
const templateFunction = sliderTemplateHbs || template;

class Slider extends Observer implements ISlider {
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
      this.initSlider(parameters);
    }
  }

  private initSlider(parameters: IDefaultParameters, $anchorElement?: JQuery): void {
    if ($anchorElement) {
      $anchorElement.before($(templateFunction(parameters)));
      this.$slider = $anchorElement.prev();
    } else {
      this.$slider.text('');
    }

    this.updateDirection(parameters);
    this.updateTheme(parameters);

    const { hasInterval, hasScale, onChange, firstValuePercent, secondValuePercent } = parameters;
    this.runnerFrom = new Runner(this.$slider, parameters, 'firstValue');
    this.progressBar = new ProgressBar(this.$slider, parameters);
    this.runnerTo = hasInterval ? new Runner(this.$slider, parameters, 'secondValue') : null;
    this.scale = hasScale ? new Scale(this.$slider, parameters) : null;

    const isValuesPercentEqual = firstValuePercent === secondValuePercent;
    const isNeedToCorrectFirstRunnerZAxis = isValuesPercentEqual && secondValuePercent === PERCENT_MAX;
    const isNeedToCorrectSecondRunnerZAxis = isValuesPercentEqual && firstValuePercent === PERCENT_MIN;

    if (isNeedToCorrectFirstRunnerZAxis) {
      this.runnerFrom.correctZAxis();
    }

    if (isNeedToCorrectSecondRunnerZAxis) {
      this.runnerTo.correctZAxis();
    }

    if (onChange) {
      onChange(parameters);
    }

    this.initSubscribes();
  }

  private initSubscribes(): void {
    this.runnerFrom.subscribe('movedRunner', this.handleRunnerMove);

    if (this.runnerTo) {
      this.runnerTo.subscribe('movedRunner', this.handleRunnerMove);
    }

    if (this.scale) {
      this.scale.subscribe('selectedValue', this.handleScaleClick);
    }
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

    this.$slider.removeClass(oldClassName).addClass(newClassName);
  }

  private updateDirection({ isVertical }: IDefaultParameters): void {
    if (isVertical) {
      this.$slider.addClass('range-slider_direction_vertical js-range-slider_direction_vertical');
    } else {
      this.$slider.removeClass('range-slider_direction_vertical js-range-slider_direction_vertical');
    }
  }
}

export default Slider;
