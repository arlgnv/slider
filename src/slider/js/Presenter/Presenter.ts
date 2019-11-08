import Model from '../Model/Model';
import SliderView from '../View/Slider/SliderView';
import IPresenter from '../Interfaces/Presenter/IPresenter';
import IParameters from '../Interfaces/IParameters';
import IRunnerParameters from '../Interfaces/IRunnerParameters';
import IScaleParameters from '../Interfaces/IScaleParameters';

export default class Presenter implements IPresenter {
  constructor(private model: Model, private view: SliderView) {
    this.model = model;
    this.view = view;

    this.subscribeToUpdates();
  }

  public subscribeToUpdates(): void {
    this.view.subscribe('moveRunner', this.handleRunnerMove);
    this.view.subscribe('clickScale', this.handleScaleClick);
    this.view.subscribe('windowResize', this.handleWindowResize);
    this.model.subscribe('updateState', this.handleModelUpdate);
  }

  private handleRunnerMove =
    (parameters: IRunnerParameters): void => this.model.updateState({ ...parameters, condition: 'afterUpdatePercent' })

  private handleScaleClick =
    (parameters: IScaleParameters): void => this.model.updateState({ ...parameters, condition: 'afterUpdateSingleValue' })

  private handleModelUpdate =
    (parameters: IParameters): void => this.view.updateSlider(parameters)

  private handleWindowResize =
    (): void => this.view.updateSlider({ ...this.model.getState(), condition: 'afterUpdateState' })
}
