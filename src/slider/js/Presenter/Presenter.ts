import Model from '../Model/Model';
import SliderView from '../View/Slider/SliderView';
import IPresenter from '../Interfaces/Presenter/IPresenter';
import IFullParameters from '../Interfaces/IFullParameters';
import IPercentParameters from '../Interfaces/IPercentParameters';

export default class Presenter implements IPresenter {
  constructor(private model: Model, private view: SliderView) {
    this.model = model;
    this.view = view;

    this.subscribeToUpdates();
  }

  public subscribeToUpdates(): void {
    this.view.subscribe('interactWithSlider', this.handleSliderInteract);
    this.model.subscribe('updateState', this.handleModelUpdate);
  }

  private handleSliderInteract =
    (parameters: IPercentParameters): void => this.model.dispatchState({ ...parameters, kind: 'valuePercentUpdated' })

  private handleModelUpdate =
    (parameters: IFullParameters): void => this.view.updateSlider(parameters)
}
