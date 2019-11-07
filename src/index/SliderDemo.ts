import IApp from '../slider/js/Interfaces/App/IApp';
import IParameters from '../slider/js/Interfaces/IParameters';

export default class SliderDemo {
  private parameters: IParameters;
  private slider: JQuery;
  private sliderData: IApp;
  private sliderElement: JQuery;
  private fieldFirstValue: JQuery;
  private fieldSecondValue: JQuery;
  private fieldMin: JQuery;
  private fieldMax: JQuery;
  private fieldStep: JQuery;
  private fieldScale: JQuery;
  private fieldTip: JQuery;
  private fieldTheme: JQuery;
  private fieldType: JQuery;
  private fieldView: JQuery;

  constructor(slider: JQuery, parameters: IParameters) {
    this.parameters = parameters;
    this.parameters.onChange = this.handleSliderChange;

    this.findDOMElements(slider);
    this.addEventListeners();
    this.init();
  }

  private findDOMElements(slider: JQuery): void {
    this.slider = slider;
    this.sliderElement = this.slider.find('.slider__field').first();
    this.fieldFirstValue = this.slider.find('[name=firstValue]');
    this.fieldSecondValue = this.slider.find('[name=secondValue]');
    this.fieldMin = this.slider.find('[name=min]');
    this.fieldMax = this.slider.find('[name=max]');
    this.fieldStep = this.slider.find('[name=step]');
    this.fieldScale = this.slider.find('[name=hasScale]');
    this.fieldTip = this.slider.find('[name=hasTip]');
    this.fieldTheme = this.slider.find('[name=theme]');
    this.fieldType = this.slider.find('[name=hasInterval]');
    this.fieldView = this.slider.find('[name=isVertical]');
  }

  private addEventListeners() {
    const updateSliderFunction = this.updateSlider;

    this.slider.find('input').each(function () {
      const elem = $(this);

      if (elem .prop('type') === 'text') elem.on('blur', updateSliderFunction);
      else elem.on('click', updateSliderFunction);
    });
  }

  private init(): void {
    this.sliderElement.rangeSlider(this.parameters);

    this.sliderData = this.sliderElement.data('rangeSlider');
  }

  private handleSliderChange = (parameters: IParameters): void => {
    const { firstValue, secondValue, min, max, step,
      hasScale, hasTip, hasInterval, isVertical, theme } = parameters;

    this.fieldFirstValue.val(firstValue);
    this.fieldSecondValue.val(secondValue);
    this.fieldMin.val(min);
    this.fieldMax.val(max);
    this.fieldStep.val(step);
    this.fieldScale.prop('checked', hasScale);
    this.fieldTip.prop('checked', hasTip);
    this.fieldType.prop('checked', hasInterval);
    this.fieldView.prop('checked', isVertical);
    this.slider.find(`[name=theme][value=${theme}]`).prop('checked', true);
  }

  private updateSlider = (evt: JQuery.ClickEvent): void => {
    const $target: JQuery = $(evt.currentTarget);
    const elemType = $target.attr('type');

    if (elemType === 'text') this.sliderData.update({ [$target.attr('name')]: +$target.val() });
    if (elemType === 'radio') this.sliderData.update({ [$target.attr('name')]: $target.val() });
    if (elemType === 'checkbox') this.sliderData.update({ [$target.attr('name')]: $target.prop('checked') });
  }
}
