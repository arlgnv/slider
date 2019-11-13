import EventEmitter from '../../EventEmitter/EventEmitter';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import scaleTemplateHbs from './scaleTemplate.hbs';

export default class ScaleView extends EventEmitter {
  private $slider: JQuery;
  private $scale: JQuery;

  constructor($slider: JQuery) {
    super();

    this.init($slider);
  }

  update({ min, max, step }: IDefaultParameters): void {
    this.$scale.text('');

    const isVertical = this.$slider.hasClass('lrs_direction_vertical');
    const metric = isVertical ? 'outerHeight' : 'outerWidth';
    const property = isVertical ? 'bottom' : 'left';
    const sliderSize = this.$slider[metric]();
    const runnerSize = this.$slider.find('.lrs__runner')[metric]();
    let amountMarks = (max - min) / step;
    let currentStep = step;

    while (amountMarks > 20) {
      amountMarks /= 2;
      currentStep *= 2;
    }

    for (let i: number = 0, value = min; i < amountMarks; i += 1) {
      const position = (sliderSize - runnerSize) / 100 * ((value - min) * 100) / (max - min);

      $('<span>', {class: 'lrs__scale-mark', text: value,
        style: `${property}: ${position}px` }).appendTo(this.$scale);

      value += currentStep;
    }

    $('<span>', {class: 'lrs__scale-mark', text: max,
      style: `${property}: ${sliderSize - runnerSize}px` }).appendTo(this.$scale);
  }

  getScale(): JQuery {
    return this.$scale;
  }

  private handleScaleClick = (evt: JQuery.ClickEvent): void => {
    const $target: JQuery = $(evt.target);
    const position = this.$slider.hasClass('lrs_direction_vertical')
      ? parseFloat($target.css('bottom'))
      : parseFloat($target.css('left'));

    if ($target.hasClass('lrs__scale-mark')) {
      this.notify('clickOnScale', { position, value: +$target.text() });
    }
  }

  private init($slider: JQuery) {
    this.$slider = $slider;
    this.$scale = $(scaleTemplateHbs());
    this.$scale.on('click', this.handleScaleClick);

    this.$slider.append(this.$scale);
  }
}
