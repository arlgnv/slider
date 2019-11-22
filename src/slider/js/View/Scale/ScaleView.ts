import Observer from '../../Observer/Observer';
import IScaleView from '../../Interfaces/View/Scale/IScaleView';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import scaleTemplateHbs from './scaleTemplate.hbs';

export default class ScaleView extends Observer implements IScaleView {
  private $slider: JQuery;
  private $scale: JQuery;

  constructor($slider: JQuery, parameters: IDefaultParameters) {
    super();

    this.initScale($slider, parameters);
  }

  updateScale({ min, max, step }: IDefaultParameters): void {
    this.$scale.text('');

    const isVertical = this.$slider.hasClass('range-slider_direction_vertical');
    const amountMarks = Math.ceil((max - min) / step) - 1;
    const values = this.beautifyMarks([
      min,
      ...Array.from({ length: amountMarks }, (e, i) => (i + 1) * step + min),
      max,
    ]);

    values.forEach((value) => {
      const position = ((value - min) / (max - min)) * 100;

      $('<span>', {class: 'range-slider__scale-mark', text: value,
        style: `${isVertical ? 'bottom' : 'left'}: ${position}%` }).appendTo(this.$scale);
    });
  }

  private handleScaleClick = (evt: JQuery.ClickEvent): void => {
    const $target: JQuery = $(evt.target);

    if ($target.hasClass('range-slider__scale-mark')) {
      const metric = this.$slider.hasClass('range-slider_direction_vertical') ? 'outerHeight' : 'outerWidth';
      const property = this.$slider.hasClass('range-slider_direction_vertical') ? 'bottom' : 'left';
      const positionPercent =
        Math.round(parseFloat($target.css(property)) / this.$slider[metric]() * 100);

      this.notify('clickOnScale', { positionPercent });
    }
  }

  private initScale($slider: JQuery, parameters: IDefaultParameters): void {
    this.$slider = $slider;
    this.$scale = $(scaleTemplateHbs());
    this.addEventListeners();
    this.$slider.append(this.$scale);
    this.updateScale(parameters);
  }

  private addEventListeners(): void {
    this.$scale.on('click', this.handleScaleClick);
  }

  private beautifyMarks(array: number[]): number[] {
    return array.length > 21
      ? this.beautifyMarks(array.filter((e, i, arr) => i % 2 === 0  || i === arr.length - 1))
      : array;
  }
}
