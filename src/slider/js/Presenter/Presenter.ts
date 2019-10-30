import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import IPresenter from '../Interfaces/Presenter/IPresenter';
import IParameters from '../Interfaces/IParameters';
import IPositionsPercent from '../Interfaces/IPositionsPercent';

export default class Presenter implements IPresenter {
  constructor(private model: Model, private view: SliderView) {
    this.model = model;
    this.view = view;

    this.subscribeForUpdates();

    this.view.reDrawView(this.model.getState());
  }

  public subscribeForUpdates(): void {
    this.view.subscribe('moveRunner', this.handleRunnerMove);
    this.view.subscribe('clickScale', this.handleScaleClick);
    this.model.subscribe('updateState', this.handleModelUpdate);
  }

  private handleRunnerMove =
    (parameters: IPositionsPercent): void => this.model.updateState(parameters)

  private handleScaleClick =
    (parameters: IParameters): void => this.model.updateState(parameters)

  private handleModelUpdate =
    (parameters: IParameters): void => this.view.reDrawView(parameters)
}
