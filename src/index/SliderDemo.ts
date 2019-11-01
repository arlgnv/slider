import IApp from '../slider/js/Interfaces/App/IApp';
import IParameters from '../slider/js/Interfaces/IParameters';

export default class SliderDemo {
  private parameters: IParameters;
  private slider: JQuery<HTMLElement>;
  private sliderData: IApp;
  private sliderElement: JQuery<HTMLElement>;
  private fieldFirstValue: JQuery<HTMLElement>;
  private fieldSecondValue: JQuery<HTMLElement>;
  private fieldMin: JQuery<HTMLElement>;
  private fieldMax: JQuery<HTMLElement>;
  private fieldStep: JQuery<HTMLElement>;
  private fieldScale: JQuery<HTMLElement>;
  private fieldTip: JQuery<HTMLElement>;
  private fieldTheme: JQuery<HTMLElement>;
  private fieldType: JQuery<HTMLElement>;
  private fieldView: JQuery<HTMLElement>;

  constructor(slider: JQuery<HTMLElement>, parameters: IParameters) {
    this.parameters = parameters;

    this.prepareDOMElements(slider);
    this.init();
  }

  private prepareDOMElements(slider: JQuery<HTMLElement>): void {
    this.slider = slider;
    this.sliderElement = this.slider.find('.slider__field').first();
    this.fieldFirstValue = this.slider.find('[name=firstValue]').on('blur', this.updateSlider);
    this.fieldSecondValue = this.slider.find('[name=secondValue]').on('blur', this.updateSlider);
    this.fieldMin = this.slider.find('[name=min]').on('blur', this.updateSlider);
    this.fieldMax = this.slider.find('[name=max]').on('blur', this.updateSlider);
    this.fieldStep = this.slider.find('[name=step]').on('blur', this.updateSlider);
    this.fieldScale = this.slider.find('[name=hasScale]').on('click', this.updateSlider);
    this.fieldTip = this.slider.find('[name=hasTip]').on('click', this.updateSlider);
    this.fieldTheme = this.slider.find('[name=theme]').on('click', this.updateSlider);
    this.fieldType = this.slider.find('[name=hasInterval]').on('click', this.updateSlider);
    this.fieldView = this.slider.find('[name=isVertical]').on('click', this.updateSlider);
  }

  private init(): void {
    this.sliderElement.rangeSlider(this.parameters);

    this.sliderData = this.sliderElement.data('rangeSlider');
    this.sliderData.update({ onChange: this.handleSliderChange });
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
    const $target: JQuery<HTMLElement> = $(evt.currentTarget);
    const elemType = $target.attr('type');

    if (elemType === 'text') this.sliderData.update({ [$target.attr('name')]: +$target.val() });
    if (elemType === 'radio') this.sliderData.update({ [$target.attr('name')]: $target.val() });
    if (elemType === 'checkbox') this.sliderData.update({ [$target.attr('name')]: $target.prop('checked') });
  }
}
