import EventEmitter from '../../EventEmitter/EventEmitter';
import SliderView from '../Slider/SliderView';
import IParameters from '../../Interfaces/IParameters';
import scaleTemplateHbs from './scaleTemplate.hbs';

export default class ScaleView {
  private slider: SliderView;
  private $slider: JQuery;
  private $scale: JQuery;

  constructor(slider: SliderView, $slider: JQuery) {
    this.init(slider, $slider);
  }

  update({ min, max, step, isVertical }: IParameters): void {
    this.$scale.text('');

    const property = isVertical ? 'bottom' : 'left';
    const sliderSize = isVertical ? this.$slider.outerHeight() : this.$slider.outerWidth();
    let amountMarks = (max - min) / step;
    let currentStep = step;

    while (amountMarks > 20) {
      amountMarks /= 2;
      currentStep *= 2;
    }

    for (let i: number = 0, value = min; i < amountMarks; i += 1) {
      const position = sliderSize / 100 * ((value - min) * 100) / (max - min);

      $('<span>', {class: 'lrs__scale-mark', text: value,
        style: `${property}: ${position}px` }).appendTo(this.$scale);

      value += currentStep;
    }

    $('<span>', {class: 'lrs__scale-mark', text: max,
      style: `${property}: ${sliderSize}px` }).appendTo(this.$scale);
  }

  private init(slider: SliderView, $slider: JQuery) {
    this.slider = slider;
    this.$slider = $slider;
    this.$scale = $(scaleTemplateHbs());

    this.$slider.append(this.$scale);
  }
}
