import progressBarTemplateHbs from './progressBarTemplate.hbs';
import IProgressBarView from '../../Interfaces/View/ProgressBar/IProgressBarView';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';
import { PERCENT_MIN, PERCENT_MAX } from '../../constants';

export default class ProgressBar implements IProgressBarView {
  private $slider: JQuery;
  private $bar: JQuery;

  constructor($slider: JQuery, parameters: IDefaultParameters) {
    this.initProgressBar($slider, parameters);
  }

  public updateProgressBar(leftoffset: number, rightoffset: number | null): void {
    const isVertical = this.$slider.hasClass('range-slider_direction_vertical');
    const leftEdge = rightoffset ? leftoffset : PERCENT_MIN;
    const rightEdge = rightoffset ? PERCENT_MAX - rightoffset : PERCENT_MAX - leftoffset;

    if (isVertical) {
      this.$bar.attr('style', `bottom: ${leftEdge}%; top: ${rightEdge}%;`);
    } else {
      this.$bar.attr('style', `left: ${leftEdge}%; right: ${rightEdge}%;`);
    }
  }

  private initProgressBar($slider: JQuery, parameters: IDefaultParameters): void {
    this.$slider = $slider;
    this.$bar = $(progressBarTemplateHbs());

    this.$slider.append(this.$bar);

    const { firstValuePercent, secondValuePercent } = parameters;
    this.updateProgressBar(firstValuePercent, secondValuePercent);
  }
}
