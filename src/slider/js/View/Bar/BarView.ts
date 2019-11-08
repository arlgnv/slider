import SliderView from '../Slider/SliderView';
import IParameters from '../../Interfaces/IParameters';
import barTemplateHbs from './barTemplate.hbs';

export default class BarView {
  private slider: SliderView;
  private $slider: JQuery;
  private $bar: JQuery;

  constructor(slider: SliderView, $slider: JQuery) {
    this.init(slider, $slider);
  }

  update({ hasInterval, isVertical }: IParameters): void {
    const sliderSize = this.slider.getSliderSize();
    const runnerFromPosition = this.slider.getRunnerFromPosition();
    const runnerToPosition = hasInterval ? this.slider.getRunnerToPosition() : null;
    const leftEdge = hasInterval ? parseFloat(runnerFromPosition) : 0;
    const rightEdge = hasInterval
      ? sliderSize - parseFloat(runnerToPosition) : sliderSize - parseFloat(runnerFromPosition);

    if (isVertical) this.$bar.attr('style', `bottom: ${leftEdge}px; top: ${rightEdge}px;`);
    else this.$bar.attr('style', `left: ${leftEdge}px; right: ${rightEdge}px;`);
  }

  private init(slider: SliderView, $slider: JQuery) {
    this.slider = slider;
    this.$slider = $slider;
    this.$bar = $(barTemplateHbs());

    this.$slider.append(this.$bar);
  }
}
