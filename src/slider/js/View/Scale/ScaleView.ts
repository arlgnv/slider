import EventEmitter from '../../EventEmitter/EventEmitter';
import IFullParameters from '../../Interfaces/IFullParameters';
import scaleTemplateHbs from './scaleTemplate.hbs';

export default class ScaleView extends EventEmitter {
  private $slider: JQuery;
  private $scale: JQuery;

  constructor($slider: JQuery, parameters: IFullParameters) {
    super();

    this.init($slider, parameters);
  }

  update({ min, max, step }: IFullParameters): void {
    const isVertical = this.$slider.hasClass('lrs_direction_vertical');

    this.$scale.text('');

    let amountMarks = (max - min) / step;
    let currentStep = step;
    while (amountMarks > 20) {
      amountMarks /= 2;
      currentStep *= 2;
    }

    for (let i: number = 0, value = min; i < amountMarks; i += 1) {
      const position = ((value - min) / (max - min)) * 100;

      $('<span>', {class: 'lrs__scale-mark', text: value,
        style: `${isVertical ? 'bottom' : 'left'}: ${position}%` }).appendTo(this.$scale);

      value += currentStep;
    }

    $('<span>', {class: 'lrs__scale-mark', text: max,
      style: `${isVertical ? 'bottom' : 'left'}: 100%` }).appendTo(this.$scale);
  }

  getScale(): JQuery {
    return this.$scale;
  }

  private handleScaleClick = (evt: JQuery.ClickEvent): void => {
    const $target: JQuery = $(evt.target);
    const metric = this.$slider.hasClass('lrs_direction_vertical') ? 'outerHeight' : 'outerWidth';
    const positionPercent = this.$slider.hasClass('lrs_direction_vertical')
      ? Math.round(parseFloat($target.css('bottom')) / this.$slider[metric]() * 100)
      : Math.round(parseFloat($target.css('left')) / this.$slider[metric]() * 100);

    if ($target.hasClass('lrs__scale-mark')) {
      this.notify('clickOnScale', { positionPercent });
    }
  }

  private init($slider: JQuery, parameters: IFullParameters) {
    this.$slider = $slider;
    this.$scale = $(scaleTemplateHbs());
    this.$scale.on('click', this.handleScaleClick);

    this.$slider.append(this.$scale);
    this.update(parameters);
  }
}
