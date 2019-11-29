import IApp from '../../plugin/Interfaces/App/IApp';
import IDefaultParameters from '../../plugin/Model/IDefaultParameters';

export default class Slider {
  private parameters: Partial<IDefaultParameters>;
  private sliderData: IApp;
  private $slider: JQuery;
  private $sliderElement: JQuery;
  private $dashboard: JQuery;
  private $fieldFirstValue: JQuery;
  private $fieldSecondValue: JQuery;
  private $fieldMin: JQuery;
  private $fieldMax: JQuery;
  private $fieldStep: JQuery;
  private $fieldScale: JQuery;
  private $fieldTip: JQuery;
  private $fieldThemeAqua: JQuery;
  private $fieldThemeRed: JQuery;
  private $fieldType: JQuery;
  private $fieldView: JQuery;

  constructor($slider: JQuery, parameters: Partial<IDefaultParameters>) {
    this.parameters = { ...parameters, onChange: this.updateSlider };

    this.initSlider($slider);
  }

  private findDomElements($slider: JQuery): void {
    this.$slider = $slider;
    this.$sliderElement = this.$slider.find('.js-slider__field');
    this.$dashboard = this.$slider.find('.js-dashboard');
    this.$fieldFirstValue = this.$dashboard.find('.js-dashboard__field_type_first-value');
    this.$fieldSecondValue = this.$dashboard.find('.js-dashboard__field_type_second-value');
    this.$fieldMin = this.$dashboard.find('.js-dashboard__field_type_min-value');
    this.$fieldMax = this.$dashboard.find('.js-dashboard__field_type_max-value');
    this.$fieldStep = this.$dashboard.find('.js-dashboard__field_type_step-value');
    this.$fieldScale = this.$dashboard.find('.js-dashboard__field_type_has-scale');
    this.$fieldTip = this.$dashboard.find('.js-dashboard__field_type_has-tip');
    this.$fieldThemeAqua = this.$dashboard.find('.js-dashboard__field_type_aqua-theme');
    this.$fieldThemeRed = this.$dashboard.find('.js-dashboard__field_type_red-theme');
    this.$fieldType = this.$dashboard.find('.js-dashboard__field_type_has-interval');
    this.$fieldView = this.$dashboard.find('.js-dashboard__field_type_is-vertical');
  }

  private addEventListeners(): void {
    this.$fieldFirstValue.on('blur', this.dispatchParameters);
    this.$fieldSecondValue.on('blur', this.dispatchParameters);
    this.$fieldMin.on('blur', this.dispatchParameters);
    this.$fieldMax.on('blur', this.dispatchParameters);
    this.$fieldStep.on('blur', this.dispatchParameters);
    this.$fieldScale.on('click', this.dispatchParameters);
    this.$fieldTip.on('click', this.dispatchParameters);
    this.$fieldThemeAqua.on('click', this.dispatchParameters);
    this.$fieldThemeRed.on('click', this.dispatchParameters);
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

    if (theme === 'aqua') {
      this.$fieldThemeAqua.prop('checked', true);
    }

    if (theme === 'red') {
      this.$fieldThemeRed.prop('checked', true);
    }
  }

  private dispatchParameters = (evt: JQuery.TriggeredEvent): void => {
    const $target: JQuery = $(evt.currentTarget);
    const targetType = $target.attr('type');

    if (targetType === 'checkbox') {
      this.sliderData.update({ [$target.attr('name')]: $target.prop('checked') });
    } else if (targetType === 'radio') {
      this.sliderData.update({ [$target.attr('name')]: $target.val() });
    } else {
      this.sliderData.update({ [$target.attr('name')]: +$target.val() });
    }
  }
}
