import progressBarTemplateHbs from './progressBarTemplate.hbs';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';

export default class ProgressBar {
  private $slider: JQuery;
  private $bar: JQuery;

  constructor($slider: JQuery, parameters: IDefaultParameters) {
    this.init($slider, parameters);
  }

  update(runnerFromPosition: number, runnerToPosition: number | null): void {
    const isVertical = this.$slider.hasClass('range-slider_direction_vertical');
    const leftEdge = runnerToPosition ? runnerFromPosition : 0;
    const rightEdge = runnerToPosition ? 100 - runnerToPosition : 100 - runnerFromPosition;

    if (isVertical) this.$bar.attr('style', `bottom: ${leftEdge}%; top: ${rightEdge}%;`);
    else this.$bar.attr('style', `left: ${leftEdge}%; right: ${rightEdge}%;`);
  }

  private init($slider: JQuery, parameters: IDefaultParameters): void {
    this.$slider = $slider;
    this.$bar = $(progressBarTemplateHbs());

    this.$slider.append(this.$bar);

    const { firstValuePercent, secondValuePercent } = parameters;

    this.update(firstValuePercent, secondValuePercent ? secondValuePercent : null);
  }
}
