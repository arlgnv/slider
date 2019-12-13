import Observer from '../../Observer/Observer';
import IScale from '../../Interfaces/View/Scale/IScale';
import { IDefaultParameters } from '../../Interfaces/Model/IModel';
import { PERCENT_MAX } from '../../constants';
import scaleTemplateHbs, * as template from './scaleTemplate.hbs';
const templateFunction = scaleTemplateHbs || template;

class Scale extends Observer implements IScale {
  private $slider: JQuery;
  private $scale: JQuery;

  constructor($slider: JQuery, parameters: IDefaultParameters) {
    super();

    this.initScale($slider, parameters);
  }

  public updateScale({ min, max, step, isVertical }: IDefaultParameters): void {
    const amountMarks = Math.ceil((max - min) / step) - 1;
    const values = [
      min,
      ...Array.from({ length: amountMarks }, (e, i) => (i + 1) * step + min),
      max,
    ];

    this.drawMarks(this.scaleMarks(values), min, max, isVertical);
  }

  private drawMarks(values: number[], min: number, max: number, isVertical: boolean): void {
    this.$scale.text('');

    values.forEach((value) => {
      const position = ((value - min) / (max - min)) * PERCENT_MAX;

      $('<span>', {
        class: 'range-slider__scale-mark js-range-slider__scale-mark',
        text: value,
        style: `${isVertical ? 'bottom' : 'left'}: ${position}%` }).appendTo(this.$scale);
    });
  }

  private handleScaleClick = (evt: JQuery.ClickEvent): void => {
    const $target: JQuery = $(evt.target);

    if ($target.hasClass('js-range-slider__scale-mark')) {
      const isVertical = this.$slider.hasClass('js-range-slider_direction_vertical');
      const metric = isVertical ? 'outerHeight' : 'outerWidth';
      const property = isVertical ? 'bottom' : 'left';
      const positionPercent =
        Math.round(parseFloat($target.css(property)) / this.$slider[metric]() * PERCENT_MAX);

      this.notify('selectedValue', { lastUpdatedOnPercent: 'either', percent: positionPercent });
    }
  }

  private initScale($slider: JQuery, parameters: IDefaultParameters): void {
    this.$slider = $slider;
    this.$scale = $(templateFunction());
    this.addEventListeners();
    this.$slider.append(this.$scale);
    this.updateScale(parameters);
  }

  private addEventListeners(): void {
    this.$scale.on('click', this.handleScaleClick);
  }

  private scaleMarks(marks: number[]): number[] {
    return marks.length > 21
      ? this.scaleMarks(marks.filter((e, i, arr) => i % 2 === 0  || i === arr.length - 1))
      : marks;
  }
}

export default Scale;
