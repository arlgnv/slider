import IApp from '../slider/js/Interfaces/App/IApp';
import IDefaultParameters from '../slider/js/Interfaces/IDefaultParameters';

export default class Slider {
  private parameters: Partial<IDefaultParameters>;
  private sliderData: IApp;
  private $slider: JQuery;
  private $sliderElement: JQuery;
  private $fieldFirstValue: JQuery;
  private $fieldSecondValue: JQuery;
  private $fieldMin: JQuery;
  private $fieldMax: JQuery;
  private $fieldStep: JQuery;
  private $fieldScale: JQuery;
  private $fieldTip: JQuery;
  private $fieldTheme: JQuery;
  private $fieldType: JQuery;
  private $fieldView: JQuery;

  constructor($slider: JQuery, parameters: Partial<IDefaultParameters>) {
    this.parameters = { ...parameters, onChange: this.updateSlider };

    this.initSlider($slider);
  }

  private findDomElements($slider: JQuery): void {
    this.$slider = $slider;
    this.$sliderElement = this.$slider.find('.slider__field').first();
    this.$fieldFirstValue = this.$slider.find('[name=firstValue]');
    this.$fieldSecondValue = this.$slider.find('[name=secondValue]');
    this.$fieldMin = this.$slider.find('[name=min]');
    this.$fieldMax = this.$slider.find('[name=max]');
    this.$fieldStep = this.$slider.find('[name=step]');
    this.$fieldScale = this.$slider.find('[name=hasScale]');
    this.$fieldTip = this.$slider.find('[name=hasTip]');
    this.$fieldTheme = this.$slider.find('[name=theme]');
    this.$fieldType = this.$slider.find('[name=hasInterval]');
    this.$fieldView = this.$slider.find('[name=isVertical]');
  }

  private addEventListeners(): void {
    this.$fieldFirstValue.on('blur', this.dispatchParameters);
    this.$fieldSecondValue.on('blur', this.dispatchParameters);
    this.$fieldMin.on('blur', this.dispatchParameters);
    this.$fieldMax.on('blur', this.dispatchParameters);
    this.$fieldStep.on('blur', this.dispatchParameters);
    this.$fieldScale.on('click', this.dispatchParameters);
    this.$fieldTip.on('click', this.dispatchParameters);
    this.$fieldTheme.on('click', this.dispatchParameters);
    this.$fieldType.on('click', this.dispatchParameters);
    this.$fieldView.on('click', this.dispatchParameters);
  }

  private initSlider($slider: JQuery): void {
    this.findDomElements($slider);
    this.addEventListeners();

    this.$sliderElement.rangeSlider(this.parameters);
    this.sliderData = this.$sliderElement.data('rangeSlider');
  }

  private updateSlider = (parameters: IDefaultParameters): void => {
    const { firstValue, secondValue, min, max, step,
      hasScale, hasTip, hasInterval, isVertical, theme } = parameters;

    this.$fieldFirstValue.val(firstValue);
    this.$fieldSecondValue.val(secondValue);
    this.$fieldMin.val(min);
    this.$fieldMax.val(max);
    this.$fieldStep.val(step);
    this.$fieldScale.prop('checked', hasScale);
    this.$fieldTip.prop('checked', hasTip);
    this.$fieldType.prop('checked', hasInterval);
    this.$fieldView.prop('checked', isVertical);
    this.$slider.find(`[name=theme][value=${theme}]`).prop('checked', true);
  }

  private dispatchParameters = (evt: JQuery.TriggeredEvent): void => {
    const $target: JQuery = $(evt.currentTarget);
    const targetType = $target.attr('type');

    if (targetType === 'checkbox') {
      this.sliderData.update({ [$target.attr('name')]: $target.prop('checked') });
    } else {
      this.sliderData.update({ [$target.attr('name')]: +$target.val() });
    }
  }
}
