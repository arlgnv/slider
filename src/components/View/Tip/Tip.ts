import ITip from '../../Interfaces/View/Tip/ITip';
import tipTemplateHbs, * as template from './tip.template.hbs';
const templateFunction = tipTemplateHbs || template;

class Tip implements ITip {
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

export default Tip;
