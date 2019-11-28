import ITipView from '../../Interfaces/View/Tip/ITipView';
import tipTemplateHbs, * as template from './tipTemplate.hbs';
const templateFunction = tipTemplateHbs || template;

export default class TipView implements ITipView {
  private $runner: JQuery;
  private $tip: JQuery;

  constructor($runner: JQuery, value: number) {
    this.initTip($runner, value);
  }

  public updateTip(value: number): void {
    this.$tip.text(value);
  }

  private initTip($runner: JQuery, value: number): void {
    this.$runner = $runner;
    this.$tip = $(templateFunction());
    this.$runner.append(this.$tip);
    this.updateTip(value);
  }
}
