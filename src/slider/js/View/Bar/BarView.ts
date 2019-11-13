import barTemplateHbs from './barTemplate.hbs';

export default class BarView {
  private $slider: JQuery;
  private $bar: JQuery;

  constructor($slider: JQuery) {
    this.init($slider);
  }

  update(runnerFromPosition: number, runnerToPosition: number | null): void {
    const isVertical = this.$slider.hasClass('lrs_direction_vertical');
    const sliderSize = isVertical ? this.$slider.outerHeight() : this.$slider.outerWidth();
    const leftEdge = runnerToPosition ? runnerFromPosition : 0;
    const rightEdge = runnerToPosition
      ? sliderSize - runnerToPosition : sliderSize - runnerFromPosition;

    if (isVertical) this.$bar.attr('style', `bottom: ${leftEdge}px; top: ${rightEdge}px;`);
    else this.$bar.attr('style', `left: ${leftEdge}px; right: ${rightEdge}px;`);
  }

  private init($slider: JQuery) {
    this.$slider = $slider;
    this.$bar = $(barTemplateHbs());

    this.$slider.append(this.$bar);
  }
}
