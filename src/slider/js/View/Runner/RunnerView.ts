import EventEmitter from '../../EventEmitter/EventEmitter';
import SliderView from '../Slider/SliderView';
import IParameters from '../../Interfaces/IParameters';
import runnerTemplateHbs from './runnerTemplate.hbs';

export default class RunnerView extends EventEmitter {
  private slider: SliderView;
  private $slider: JQuery;
  private $runner: JQuery;
  private $tip: JQuery;

  constructor(slider: SliderView, $slider: JQuery, parameters: IParameters) {
    super();

    this.init(slider, $slider, parameters);
  }

  update(positionPercent: number, value?: number) {
    const isVertical = this.$slider.hasClass('lrs_direction_vertical');
    const sliderSize = this.slider.getSliderSize();
    const runnerSize = isVertical ? this.$runner.outerHeight() : this.$runner.outerWidth();
    const runnerOffset = ((sliderSize - runnerSize) * positionPercent) / 100;

    this.$runner.attr('style', `${isVertical ? 'bottom' : 'left'}: ${runnerOffset}px`);

    if (this.$tip) this.$tip.text(value);
  }

  getPosition(): string {
    return this.$slider.hasClass('lrs_direction_vertical')
      ? this.$runner.css('bottom') : this.$runner.css('left');
  }

  private init(slider: SliderView, $slider: JQuery, parameters: IParameters) {
    this.slider = slider;
    this.$slider = $slider;
    this.$runner = $(runnerTemplateHbs(parameters));
    if (parameters.hasTip) this.$tip = this.$runner.find('.lrs__tip');

    this.$slider.append(this.$runner);
  }
}
