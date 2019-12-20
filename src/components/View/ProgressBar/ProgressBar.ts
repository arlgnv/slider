import IProgressBar from '../../Interfaces/View/ProgressBar/IProgressBar';
import { IDefaultParameters } from '../../Interfaces/Model/IModel';
import { PERCENT_MIN, PERCENT_MAX } from '../../constants';
import progressBarTemplateHbs, * as template from './progressBar.template.hbs';
const templateFunction = progressBarTemplateHbs || template;

class ProgressBar implements IProgressBar {
  private $slider: JQuery;
  private $progressBar: JQuery;

  constructor($slider: JQuery, parameters: IDefaultParameters) {
    this.initProgressBar($slider, parameters);
  }

  public updateProgressBar(leftOffset: number, rightOffset: number | null): void {
    const isVertical = this.$slider.hasClass('js-range-slider_direction_vertical');
    const leftEdge = rightOffset ? leftOffset : PERCENT_MIN;
    const rightEdge = rightOffset ? PERCENT_MAX - rightOffset : PERCENT_MAX - leftOffset;

    if (isVertical) {
      this.$progressBar.attr('style', `bottom: ${leftEdge}%; top: ${rightEdge}%;`);
    } else {
      this.$progressBar.attr('style', `left: ${leftEdge}%; right: ${rightEdge}%;`);
    }
  }

  private initProgressBar($slider: JQuery, parameters: IDefaultParameters): void {
    this.$slider = $slider;
    this.$progressBar = $(templateFunction());

    this.$slider.append(this.$progressBar);

    const { firstValuePercent, secondValuePercent } = parameters;
    this.updateProgressBar(firstValuePercent, secondValuePercent);
  }
}

export default ProgressBar;
