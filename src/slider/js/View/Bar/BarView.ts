import barTemplateHbs from './barTemplate.hbs';
import IFullParameters from '../../Interfaces/IFullParameters';

export default class BarView {
  private $slider: JQuery;
  private $bar: JQuery;

  constructor($slider: JQuery, parameters: IFullParameters) {
    this.init($slider, parameters);
  }

  update(runnerFromPosition: number, runnerToPosition: number | null): void {
    const isVertical = this.$slider.hasClass('lrs_direction_vertical');
    const leftEdge = runnerToPosition ? runnerFromPosition : 0;
    const rightEdge = runnerToPosition ? 100 - runnerToPosition : 100 - runnerFromPosition;

    if (isVertical) this.$bar.attr('style', `bottom: ${leftEdge}%; top: ${rightEdge}%;`);
    else this.$bar.attr('style', `left: ${leftEdge}%; right: ${rightEdge}%;`);
  }

  private init($slider: JQuery, parameters: IFullParameters): void {
    this.$slider = $slider;
    this.$bar = $(barTemplateHbs());

    this.$slider.append(this.$bar);

    const { firstValuePercent, secondValuePercent } = parameters;

    this.update(firstValuePercent, secondValuePercent ? secondValuePercent : null);
  }
}
